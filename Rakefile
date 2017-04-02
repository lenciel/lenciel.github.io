require "rubygems"
require "bundler/setup"
require "stringex"
require "colorize"
require "html_compressor"
require "parallel"
require "ruby-progressbar"

## -- Rsync Deploy config -- ##
# Be sure your public key is listed in your server's ~/.ssh/authorized_keys file
ssh_user       = "user@domain.com"
ssh_port       = "22"
document_root  = "~/website.com/"
rsync_delete   = false
rsync_args     = ""  # Any extra arguments to pass to rsync
deploy_default = "push"

# This will be configured for you when you run config_deploy
deploy_branch  = "master"

## -- Misc Configs -- ##

source_dir      = "./"        # source root directory
page_dir        = "docs"      # page directory
blog_index_dir  = './'        # directory for your blog's index page
deploy_dir      = "_site"     # Github repo lenciel.github.io master branch or static site hosting folder)
stash_dir       = "_stash"    # directory to stash posts for speedy generation
posts_dir       = "_posts"    # directory for blog files
new_post_ext    = "markdown"  # default new post file extension when using the new_post task
new_page_ext    = "markdown"  # default new page file extension when using the new_page task
server_port     = "4000"      # port for preview server eg. localhost:4000
localhost_ip    = "172.16.121.110"  # just incase you're using vm like me

n_cores = 4
js_for_combine   = { 'app.js' => ['libs/modernizr.custom.55630.js', 'ender.js', 'libs/jquery.min.js'],
                     '404.js' => ['libs/jquery.min.js'] }

if (/cygwin|mswin|mingw|bccwin|wince|emx/ =~ RUBY_PLATFORM) != nil
  puts '## Set the codepage to 65001 for Windows machines'
  `chcp 65001`
end

#######################
# Working with Jekyll #
#######################

desc "Generate jekyll site"
task :generate do
  puts "## Generating Site with Jekyll"
  system "jekyll build --incremental"
end

desc "Watch the site and regenerate when it changes"
task :watch do
  puts "Starting to watch source with Jekyll."
  jekyllPid = Process.spawn("jekyll build --watch")

  trap("INT") {
    [jekyllPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid].each { |pid| Process.wait(pid) }
end

desc "preview the site in a web browser"
task :preview do
  puts "Starting to serve jekyll on #{localhost_ip}:#{server_port}"
  jekyllPid = Process.spawn("jekyll serve --host #{localhost_ip} --port #{server_port} --force_polling")

  trap("INT") {
    [jekyllPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid].each { |pid| Process.wait(pid) }
end

# maybe try jekyll-compose later rather than homebrew commands
# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Begin a new post in #{posts_dir}"
task :new_post, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  mkdir_p "#{posts_dir}"
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
    post.puts "comments: true"
    post.puts "categories: "
    post.puts "---"
  end

  Rake::Task[:isolate].invoke(filename)
end

# usage rake new_page[my-new-page] or rake new_page[my-new-page.html] or rake new_page (defaults to "new-page.markdown")
desc "Create a new page in #{page_dir}/(filename)/index.#{new_page_ext}"
task :new_page, :filename do |t, args|
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(page_dir)
  args.with_defaults(:filename => 'new-page')
  page_dir = [page_dir]
  if args.filename.downcase =~ /(^.+\/)?(.+)/
    filename, dot, extension = $2.rpartition('.').reject(&:empty?)         # Get filename and extension
    title = filename
    page_dir.concat($1.downcase.sub(/^\//, '').split('/')) unless $1.nil?  # Add path to page_dir Array
    if extension.nil?
      page_dir << filename
      filename = "index"
    end
    extension ||= new_page_ext
    page_dir = page_dir.map! { |d| d = d.to_url }.join('/')                # Sanitize path
    filename = filename.downcase.to_url

    mkdir_p page_dir
    file = "#{page_dir}/#{filename}.#{extension}"
    if File.exist?(file)
      abort("rake aborted!") if ask("#{file} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
    end
    puts "Creating new page: #{file}"
    open(file, 'w') do |page|
      page.puts "---"
      page.puts "layout: page"
      page.puts "title: \"#{title}\""
      page.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
      page.puts "comments: true"
      page.puts "sharing: true"
      page.puts "footer: true"
      page.puts "---"
    end
  else
    puts "Syntax error: #{args.filename} contains unsupported characters"
  end
end

# usage rake isolate[my-post]
desc "Move all other posts than the one currently being worked on to a temporary stash location (stash) so regenerating the site happens much more quickly."
task :isolate, :filename do |t, args|
  stash_dir = "#{stash_dir}"
  FileUtils.mkdir(stash_dir) unless File.exist?(stash_dir)
  Dir.glob("#{posts_dir}/*.*") do |post|
    FileUtils.mv post, stash_dir unless post.include?(args.filename)
  end
end

desc "Move all stashed posts back into the posts directory, ready for site generation."
task :integrate do
  FileUtils.mv Dir.glob("#{stash_dir}/*.*"), "#{posts_dir}/"
end

desc "Clean out caches: .pygments-cache, .gist-cache, .sass-cache"
task :clean do
  rm_rf [Dir.glob(".pygments-cache/**"), Dir.glob(".gist-cache/**"), Dir.glob(".sass-cache/**"), "source/stylesheets/screen.css"]
end

##############
# Deploying  #
##############

desc "Default deploy task"
task :deploy do
  Rake::Task[:minify_js].execute
  Rake::Task[:minify_html].execute
  # Rake::Task[:copydot].invoke(source_dir, deploy_dir)
  Rake::Task["#{deploy_default}"].execute
end

desc "Generate website and deploy"
task :gen_deploy => [:integrate, :generate, :deploy] do
end

desc "copy dot files for deployment"
task :copydot, :source, :dest do |t, args|
  FileList["#{args.source}/**/.*"].exclude("**/.", "**/..", "**/.DS_Store", "**/._*").each do |file|
    cp_r file, file.gsub(/#{args.source}/, "#{args.dest}") unless File.directory?(file)
  end
end

desc "Deploy website via rsync"
task :rsync do
  exclude = ""
  if File.exists?('./rsync-exclude')
    exclude = "--exclude-from '#{File.expand_path('./rsync-exclude')}'"
  end
  puts "## Deploying website via Rsync"
  ok_failed system("rsync -avze 'ssh -p #{ssh_port}' #{exclude} #{rsync_args} #{"--delete" unless rsync_delete == false} #{public_dir}/ #{ssh_user}:#{document_root}")
end

# user/org pages are using master branch rather than gh-pages branch
# and if you are using self brew plugins not supported by github pages like me,
# you can only publish the static dir, not jekyll site source files.

desc "deploy directory to github user pages"
multitask :push do
  puts "## Deploying master branch to Github Pages "
  puts "## Pulling any updates from Github Pages "
  cd "#{deploy_dir}" do 
    Bundler.with_clean_env { system "git pull" }
  end
  (Dir["#{deploy_dir}/*"]).each { |f| rm_rf(f) }
  Rake::Task[:copydot].invoke(public_dir, deploy_dir)
  puts "\n## Copying #{public_dir} to #{deploy_dir}"
  cp_r "#{public_dir}/.", deploy_dir
  cd "#{deploy_dir}" do
    system "git add -A"
    message = "Site updated at #{Time.now.utc}"
    puts "\n## Committing: #{message}"
    system "git commit -m \"#{message}\""
    puts "\n## Pushing generated #{deploy_dir} website"
    Bundler.with_clean_env { system "git push origin #{deploy_branch}" }
    puts "\n## Github Pages deploy complete"
  end
end


def ok_failed(condition)
  if (condition)
    puts "OK"
  else
    puts "FAILED"
  end
end

def get_stdin(message)
  print message
  STDIN.gets.chomp
end

def ask(message, valid_options)
  if valid_options
    answer = get_stdin("#{message} #{valid_options.to_s.gsub(/"/, '').gsub(/, /,'/')} ") while !valid_options.include?(answer)
  else
    answer = get_stdin(message)
  end
  answer
end

desc "list tasks"
task :list do
  puts "Tasks: #{(Rake::Task.tasks - [Rake::Task[:list]]).join(', ')}"
  puts "(type rake -T for more detail)\n\n"
end

desc "Combine and minify js"
task :minify_js do
  scripts_dir = "assets/javascripts"
  js_for_combine.each do |k, v|
    if File.exist?("#{scripts_dir}/#{k}")
      newer = false
      v.each do |j|
        if File.mtime("#{scripts_dir}/#{j}") > File.mtime("#{scripts_dir}/#{k}")
          puts "## Newer file " + "#{j}".colorize(:blue) + " is found"
          newer = true
          break
        end
      end
    else
      newer = true
    end
    if newer
      puts "   Combining and Minify js: " + "#{k}".colorize(:red)
      output = File.new("#{scripts_dir}/#{k}", "w")
      v.each do |j|
        output << File.read("#{scripts_dir}/#{j}")
      end
      output.close
      system "uglifyjs #{scripts_dir}/#{k} -o #{scripts_dir}/#{k.split('.')[0]}.packed.js -p 5 -m -c"
    end
  end
end

desc "Minify HTML"
task :minify_html, :dir do |t, args|
  args.with_defaults(:dir => "#{public_dir}")
  htmls = Dir.glob("#{args.dir}/**/*.html")
  progressbar = ProgressBar.create(:title => "Minify HTML",
                                   :starting_at => 0,
                                   :total => htmls.size,
                                   :format => '%t, %a |%b%i| %p%')
  compressor = HtmlCompressor::HtmlCompressor.new
  Parallel.map(htmls, :in_threads => n_cores) do |f|
    input = File.read(f)
    output = File.open("#{f}", "w")
    output << compressor.compress(input)
    output.close
    progressbar.increment
  end
end