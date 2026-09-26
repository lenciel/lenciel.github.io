require "rubygems"
require "stringex"
require "colorize"
require "htmlcompressor"
require "parallel"
require "ruby-progressbar"
require "base64"
require "digest"
require "json"
require "net/http"
require "openssl"
require "time"
require "yaml"

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
back_dir       = "_site_bak"    # directory to stash posts for speedy generation
ftp_dir       = "_ftp"    # directory to stash posts for speedy generation
posts_dir       = "_posts"    # directory for blog files
new_post_ext    = "markdown"  # default new post file extension when using the new_post task
new_page_ext    = "markdown"  # default new page file extension when using the new_page task
server_port     = "4003"      # port for preview server eg. localhost:4000
# localhost_ip    = "172.16.121.110"  # just incase you're using vm like me
localhost_ip    = "0.0.0.0"  # just incase you're using vm like me

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

desc "Backup exsiting _site to site_old"
task :backup_site do
  puts "## Backing up _site to site_old"
  rm_rf Dir.glob("#{back_dir}")
  cp_r "#{ftp_dir}", back_dir
end

desc "Copy exsiting resized image to _site"
task :copy_resized do
  puts "## Copying exsiting resized image to _site"
  system "jekyll clean"
  system "mkdir -p #{deploy_dir}"
  FileUtils.cp_r Dir.glob("#{back_dir}/resized_images"), "#{deploy_dir}/"
end

task :blank_target do
  puts "add blank target for posts in _posts dir"

  files = Dir.glob("_posts/*.markdown")
  files.each do |markdown_file|
    system(
      "sed",
      "-i", "",
      "-E",
      "s/(\\[[^]]+\\]\\([^)]+\\))($|[^{])/\\1{:target=\"_blank\"}\\2/g",
      markdown_file
    )
  end
end

desc "Generate jekyll site for production deployment"
task :generate do
  Rake::Task[:blank_target].execute
  Rake::Task[:backup_site].execute
  Rake::Task[:copy_resized].execute
  puts "## Generating Site with Jekyll"
  system "JEKYLL_ENV=production jekyll build --incremental"
end

desc "Watch the prod site and regenerate when it changes"
task :watch do
  Rake::Task[:generate].execute

  puts "Starting to watch source with Jekyll."

  jekyllPid = Process.spawn({"JEKYLL_ENV"=>"production"}, "jekyll build --watch")

  trap("INT") {
    [jekyllPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid].each { |pid| Process.wait(pid) }
end

desc "preview the dev site in a web browser"
task :preview do
  Rake::Task[:generate].execute
  puts "Starting to serve jekyll on http://#{localhost_ip}:#{server_port}"

  jekyllPid = Process.spawn("jekyll serve --host #{localhost_ip} --port #{server_port}  -w -l --config _config.yml,_config_dev.yml")

  trap("INT") {
    [jekyllPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid].each { |pid| Process.wait(pid) }
end


desc "preview the prod site in a web browser"
task :preview_prod do
  Rake::Task[:generate].execute
  puts "Starting to serve jekyll on http://#{localhost_ip}:#{server_port}"

  jekyllPid = Process.spawn({"JEKYLL_ENV"=>"production"}, "jekyll serve --watch")
  puts "Starting to serve jekyll on #{jekyllPid}"

  trap("INT") {
    [jekyllPid].each { |pid| Process.kill(9, pid) rescue Errno::ESRCH }
    exit 0
  }

  [jekyllPid].each { |pid| Process.wait(pid) }
end

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
    post.puts "comments: true"
    post.puts "description: \"摘要\""
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
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
      post.puts "comments: true"
      page.puts "title: \"#{title}\""
      page.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
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
  rm_rf [Dir.glob(".pygments-cache/**"), Dir.glob(".gist-cache/**"), Dir.glob(".sass-cache/**")]
end

##############
# Deploying  #
##############

desc "Default deploy task"
task :prepare_deploy do
  Rake::Task[:integrate].execute
  Rake::Task[:generate].execute
  Rake::Task[:minify_html].execute
  rm_rf [Dir.glob("#{deploy_dir}/node_modules"), Dir.glob("#{deploy_dir}/*.md"), Dir.glob("#{deploy_dir}/*.py"), Dir.glob("#{deploy_dir}/*.json"), Dir.glob("#{deploy_dir}/*.sh"), "#{deploy_dir}/plugins", "#{deploy_dir}/Rakefile", "#{deploy_dir}/Makefile",  "#{deploy_dir}/pagefind.yml", "#{deploy_dir}/gulpfile.js"]

  puts "\n## Removing dot files (#{deploy_dir})"
  system("find #{deploy_dir} -name .DS_Store -print -delete")

  puts "\n## Copying #{deploy_dir} to #{ftp_dir}"
  rm_rf Dir.glob("#{ftp_dir}")
  mkdir ftp_dir
  cp_r "#{deploy_dir}/.", ftp_dir
  #rm_rf [Dir.glob("#{ftp_dir}/resized"), Dir.glob("#{ftp_dir}/assets"), Dir.glob("#{ftp_dir}/downloads")]

  Rake::Task[:build_pagefind].execute

  if oss_configured?
    Rake::Task[:upload_oss].execute
  else
    puts "\n## Skipping Aliyun OSS upload (set OSS_ACCESS_KEY_ID / OSS_ACCESS_KEY_SECRET to enable)"
  end
  #Rake::Task[:optimize_images].execute
  # Rake::Task[:copydot].invoke(source_dir, deploy_dir)
end

desc "Generate website and deploy"
task :deploy do
  Rake::Task["#{deploy_default}"].execute
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

 # usage rake new_fr
 desc "Begin a new Fragments 0x post in #{posts_dir}"
 task :new_fr do
   mkdir_p "#{posts_dir}"
   # Find the highest numbered Fragments 0x post (filename: 2026-09-15-fragments-0x0006.markdown)
   existing = Dir.glob("#{posts_dir}/*").map do |f|
     File.basename(f).match(/fragments-0x([0-9a-fA-F]+)/i)&.[](1)
   end.compact
   next_num = existing.empty? ? 1 : (existing.map { |s| s.to_i(16) }.max + 1)
   num_str = format('0x%04x', next_num)
   filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-fragments-#{num_str}.#{new_post_ext}"
   if File.exist?(filename)
     abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
   end
   puts "Creating new post: #{filename}"
   open(filename, 'w') do |post|
     post.puts "---"
     post.puts "layout: post"
     post.puts "comments: true"
     post.puts "description: '摘要'"
     post.puts "title: 'Fragments #{num_str}'"
     post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
     post.puts "categories: [useless-songs, wxmp]"
     post.puts "---"
   end
 end

desc "Combine and minify js"
task :minify_js do
  scripts_dir = "#{deploy_dir}/assets/javascripts"
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
  args.with_defaults(:dir => "#{deploy_dir}")
  htmls = Dir.glob("#{args.dir}/**/*.html")
  progressbar = ProgressBar.create(:title => "Minify HTML",
                                   :starting_at => 0,
                                   :total => htmls.size,
                                   :format => '%t, %a |%b%i| %p%')
  compressor = HtmlCompressor::Compressor.new
  Parallel.map(htmls, :in_threads => n_cores) do |f|
    input = File.read(f)
    output = File.open("#{f}", "w")
    output << compressor.compress(input)
    output.close
    progressbar.increment
  end
end

desc "Optimize Images"
task :optimize_images do
  puts "## Optimizing JPEG Images"
  Dir.glob("#{source_dir}/downloads/images/**/*.{jp,jpe}g").each do |f|
    if (Time.now - File.stat(f).mtime).to_i / 86400.0 < 2
      system("imagemin --plugin=mozjpeg #{f}  --out-dir=#{File.dirname(f)}/")
    end
  end
  Dir.glob("#{source_dir}/downloads/images/**/*.png").each do |f|
    if (Time.now - File.stat(f).mtime).to_i / 86400.0 < 2
      system("imagemin --plugin=pngquant #{f}  --out-dir=#{File.dirname(f)}/")
    end
  end
end

desc "Remove Unused CSS"
task :uncss do
  puts "## Removing Unused CSS"
  system("gulp uncss")
end


desc "Build Pagefind Index"
task :build_pagefind do
  puts "## Building Pagefind Index"
  system("pagefind_extended")
end

#######################
# Aliyun OSS upload   #
#######################

# Uploaded with the same relative key they have in the deploy folder, so the URLs
# the site emits (static_base/downloads/..., static_base/resized_images/...) resolve.
OSS_UPLOAD_DIRS = %w[downloads resized_images]
OSS_MANIFEST_FILE = ENV["OSS_MANIFEST"].to_s.strip.empty? ? ".oss-upload.json" : ENV["OSS_MANIFEST"].to_s.strip
OSS_CONTENT_TYPES = {
  ".avif" => "image/avif",
  ".css" => "text/css",
  ".eot" => "application/vnd.ms-fontobject",
  ".gif" => "image/gif",
  ".html" => "text/html; charset=utf-8",
  ".ico" => "image/x-icon",
  ".jpeg" => "image/jpeg",
  ".jpg" => "image/jpeg",
  ".js" => "application/javascript",
  ".json" => "application/json",
  ".m4a" => "audio/mp4",
  ".map" => "application/json",
  ".md" => "text/plain; charset=utf-8",
  ".mov" => "video/quicktime",
  ".mp3" => "audio/mpeg",
  ".mp4" => "video/mp4",
  ".ogg" => "audio/ogg",
  ".otf" => "font/otf",
  ".pdf" => "application/pdf",
  ".png" => "image/png",
  ".py" => "text/plain; charset=utf-8",
  ".sh" => "application/x-sh",
  ".svg" => "image/svg+xml",
  ".ttf" => "font/ttf",
  ".txt" => "text/plain; charset=utf-8",
  ".wav" => "audio/wav",
  ".webm" => "video/webm",
  ".webp" => "image/webp",
  ".woff" => "font/woff",
  ".woff2" => "font/woff2",
  ".zip" => "application/zip",
}.freeze
OSS_DEFAULT_CONTENT_TYPE = "application/octet-stream"

def oss_configured?
  !ENV["OSS_ACCESS_KEY_ID"].to_s.strip.empty? && !ENV["OSS_ACCESS_KEY_SECRET"].to_s.strip.empty?
end

# OSS_ENDPOINT takes a host or a URL; a http:// endpoint keeps the connection
# unencrypted so a local server can stand in for OSS. OSS_REGION is the shortcut
# for oss-<region>.aliyuncs.com.
def oss_endpoint
  raw = ENV["OSS_ENDPOINT"].to_s.strip
  if raw.empty?
    region = ENV["OSS_REGION"].to_s.strip
    raw = "oss-#{region}.aliyuncs.com" unless region.empty?
  end
  return nil if raw.empty?

  uri = URI.parse(raw.include?("//") ? raw : "https://#{raw}")
  # Bucket-in-host style needs a DNS name; IPs and localhost fall back to path style.
  { :host => uri.host, :port => uri.port, :secure => uri.scheme != "http", :path_style => uri.host == "localhost" || uri.host.match?(/\A(?:\d{1,3}\.){3}\d{1,3}\z/) }
end

# OSS_BUCKETS is a "dir=bucket[:key prefix]" list; the prefix defaults to the
# directory name so keys match the site URLs. OSS_BUCKET sends everything to one
# bucket when OSS_BUCKETS is unset.
def oss_targets
  raw = ENV["OSS_BUCKETS"].to_s.strip
  entries = raw.empty? ? OSS_UPLOAD_DIRS.map { |dir| "#{dir}=#{ENV["OSS_BUCKET"].to_s.strip}" } : raw.split(",")
  entries.map do |entry|
    dir, target = entry.split("=", 2).map { |part| part.to_s.strip }
    bucket, prefix = target.to_s.split(":", 2).map { |part| part.to_s.strip }
    { :dir => dir.to_s, :bucket => bucket.to_s, :prefix => (prefix.nil? ? dir : prefix).to_s }
  end
end

# Only used for the summary output; falls back to the domain the site itself links to.
def oss_domain
  domain = ENV["OSS_DOMAIN"].to_s.strip
  return domain unless domain.empty?

  config = begin
    YAML.safe_load_file("_config.yml")
  rescue StandardError
    nil
  end
  config.is_a?(Hash) ? config["static_base"].to_s : ""
end

def read_oss_manifest
  return {} unless File.exist?(OSS_MANIFEST_FILE)

  manifest = JSON.parse(File.read(OSS_MANIFEST_FILE))
  manifest.is_a?(Hash) ? manifest : {}
rescue JSON::ParserError => error
  abort("oss upload aborted: #{OSS_MANIFEST_FILE} is not valid JSON (#{error.message}); delete it to upload everything again")
end

# PUT and HEAD address the same object, so the bucket-in-host vs path-style choice
# and key escaping must stay in lockstep for the signature to match the request.
def oss_request_target(endpoint, bucket, key)
  escaped = key.split("/").map { |segment| URI::DEFAULT_PARSER.escape(segment) }.join("/")
  if endpoint[:path_style]
    [endpoint[:host], "/#{bucket}/#{escaped}"]
  else
    ["#{bucket}.#{endpoint[:host]}", "/#{escaped}"]
  end
end

def oss_connection(host, endpoint)
  http = Net::HTTP.new(host, endpoint[:port])
  http.use_ssl = endpoint[:secure]
  http.open_timeout = 30
  http.read_timeout = 900
  http.write_timeout = 900
  http
end

# PUT one object with the OSS v1 signature, so no SDK or CLI is needed.
# Returns nil on success and an error string otherwise.
def oss_put(endpoint, bucket, key, path, mime)
  date = Time.now.httpdate
  # OSS v1 signature, as in aliyun-oss-ruby-sdk `Util.get_signature`: no Content-MD5
  # and no x-oss-* headers are sent, so both fields are empty and add no separator.
  to_sign = "PUT\n\n#{mime}\n#{date}\n/#{bucket}/#{key}"
  signature = Base64.strict_encode64(
    OpenSSL::HMAC.digest("sha1", ENV["OSS_ACCESS_KEY_SECRET"].to_s.strip, to_sign),
  )
  host, request_path = oss_request_target(endpoint, bucket, key)

  File.open(path, "rb") do |file|
    http = oss_connection(host, endpoint)
    request = Net::HTTP::Put.new(request_path)
    request["Date"] = date
    request["Content-Type"] = mime
    request["Content-Length"] = file.size.to_s
    request["Authorization"] = "OSS #{ENV["OSS_ACCESS_KEY_ID"].to_s.strip}:#{signature}"
    request.body_stream = file
    response = http.request(request)
    return nil if response.code.to_i == 200

    "HTTP #{response.code} #{response.body.to_s.strip[0, 200]}"
  end
rescue StandardError => error
  "#{error.class}: #{error.message}"
end

# HEAD one object to see whether it is already on OSS. Returns { :size, :etag } when
# the object exists, :missing when it does not, or an error string (e.g. when the
# credentials may only write).
def oss_head(endpoint, bucket, key)
  date = Time.now.httpdate
  # Same v1 signature as PUT; HEAD sends no Content-Type and no Content-MD5.
  signature = Base64.strict_encode64(
    OpenSSL::HMAC.digest("sha1", ENV["OSS_ACCESS_KEY_SECRET"].to_s.strip, "HEAD\n\n\n#{date}\n/#{bucket}/#{key}"),
  )
  host, request_path = oss_request_target(endpoint, bucket, key)

  http = oss_connection(host, endpoint)
  http.read_timeout = 60
  request = Net::HTTP::Head.new(request_path)
  request["Date"] = date
  request["Authorization"] = "OSS #{ENV["OSS_ACCESS_KEY_ID"].to_s.strip}:#{signature}"
  response = http.request(request)

  return { :size => response["Content-Length"].to_i, :etag => response["ETag"].to_s.delete(%q{"}) } if response.code.to_i == 200
  return :missing if response.code.to_i == 404

  "HTTP #{response.code}"
rescue StandardError => error
  "#{error.class}: #{error.message}"
end

desc "Upload files added to #{OSS_UPLOAD_DIRS.join('/')} in the deploy folder to Aliyun OSS (config via OSS_* env vars)"
task :upload_oss, :dir do |t, args|
  args.with_defaults(:dir => ftp_dir)

  abort("oss upload aborted: set OSS_ACCESS_KEY_ID and OSS_ACCESS_KEY_SECRET") unless oss_configured?

  endpoint = oss_endpoint
  abort("oss upload aborted: set OSS_ENDPOINT (e.g. oss-cn-shanghai.aliyuncs.com) or OSS_REGION") if endpoint.nil?

  targets = oss_targets
  if targets.empty? || targets.any? { |target| target[:dir].empty? || target[:bucket].empty? }
    abort("oss upload aborted: set OSS_BUCKETS (dir=bucket[:prefix], e.g. downloads=my-bucket,resized_images=my-bucket) or OSS_BUCKET")
  end

  root = args.dir.to_s.sub(%r{/\z}, "")
  abort("oss upload aborted: #{root} not found, run rake prepare_deploy first") unless File.directory?(root)

  puts "\n## Uploading to Aliyun OSS"
  puts "## Endpoint: #{endpoint[:host]}:#{endpoint[:port]} (#{endpoint[:secure] ? "https" : "http"})"
  targets.each { |target| puts "## #{target[:dir]} -> oss://#{target[:bucket]}/#{target[:prefix]}" }

  manifest = read_oss_manifest
  force = ENV["OSS_FORCE"] == "1"
  pending = []
  skipped = 0

  targets.each do |target|
    dir_path = File.join(root, target[:dir])
    unless File.directory?(dir_path)
      puts "## Skipping #{target[:dir]} (not in #{root})"
      next
    end

    Dir.glob("#{dir_path}/**/*").each do |path|
      next unless File.file?(path)

      rel = path.sub(%r{\A#{Regexp.escape(root)}/}, "")
      suffix = path.sub(%r{\A#{Regexp.escape(dir_path)}/?}, "")
      key = target[:prefix].empty? ? suffix : "#{target[:prefix]}/#{suffix}"
      size = File.size(path)
      digest = Digest::SHA256.file(path).hexdigest
      recorded = manifest[rel]
      # A record only counts for the same bucket/key; otherwise (e.g. the bucket
      # changed) the file is re-checked against OSS.
      if !force && recorded.is_a?(Hash) && recorded["bucket"] == target[:bucket] && recorded["key"] == key &&
         recorded["size"] == size && recorded["sha256"] == digest
        skipped += 1
        next
      end

      pending << {
        :rel => rel,
        :path => path,
        :key => key,
        :bucket => target[:bucket],
        :size => size,
        :sha256 => digest,
        :md5 => Digest::MD5.file(path).hexdigest,
        :mime => OSS_CONTENT_TYPES[File.extname(path).downcase] || OSS_DEFAULT_CONTENT_TYPE,
      }
    end
  end

  if pending.empty?
    puts "## Nothing to upload (#{skipped} files unchanged)"
  else
    megabytes = pending.sum { |item| item[:size] } / 1024 / 1024
    puts "## Uploading #{pending.size} files (#{megabytes} MB), #{skipped} unchanged"
    progressbar = ProgressBar.create(:title => "Uploading",
                                     :starting_at => 0,
                                     :total => pending.size,
                                     :format => '%t, %a |%b%i| %p%')

    # OSS_VERIFY=0 skips the HEAD probe and uploads every candidate as before.
    probing = { :enabled => ENV["OSS_VERIFY"] != "0" }
    results = Parallel.map(pending, :in_threads => n_cores) do |item|
      present = false
      if probing[:enabled]
        remote = oss_head(endpoint, item[:bucket], item[:key])
        if remote.is_a?(Hash)
          # The ETag of a single-part upload is the object's MD5; anything else
          # (multipart, encrypted) only allows a size comparison.
          present = remote[:etag].match?(/\A[0-9a-f]{32}\z/i) ? remote[:etag].casecmp?(item[:md5]) : remote[:size] == item[:size]
        elsif remote != :missing
          # The credentials cannot read the bucket (write-only policy): stop
          # probing and upload as before.
          probing[:enabled] = false
        end
      end

      error = present ? nil : oss_put(endpoint, item[:bucket], item[:key], item[:path], item[:mime])
      progressbar.increment
      [item, error, present]
    end

    failures = results.reject { |(_, error, _)| error.nil? }
    uploaded = results.count { |(_, error, present)| error.nil? && !present }
    on_oss = results.count { |(_, _, present)| present }
    results.each do |(item, error, _)|
      next unless error.nil?

      manifest[item[:rel]] = {
        "bucket" => item[:bucket],
        "key" => item[:key],
        "size" => item[:size],
        "sha256" => item[:sha256],
      }
    end
    File.write(OSS_MANIFEST_FILE, "#{JSON.pretty_generate(manifest.sort.to_h)}\n")

    domain = oss_domain.sub(%r{/\z}, "")
    puts "## Uploaded #{uploaded} files to #{pending.map { |item| item[:bucket] }.uniq.join(", ")}" \
         "#{on_oss.zero? ? "" : ", #{on_oss} already on OSS"}"
    puts "## Example URL: #{domain.empty? ? pending.first[:key] : "#{domain}/#{pending.first[:key]}"}"

    unless failures.empty?
      failures.each { |(item, error)| puts "## FAILED #{item[:rel]}: #{error}" }
      abort("oss upload aborted: #{failures.size} of #{pending.size} files failed, rerun rake upload_oss to retry")
    end
  end
end
