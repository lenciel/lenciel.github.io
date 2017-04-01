all: update

preview:
	rake preview

update_source:
	git checkout source \
	git pull \
	git add .; \
	git commit -am "blog source update $$(date +%Y-%m-%d)"; \
	git push origin source

update_blog:
	git checkout source \
	git pull \
	rake gen_deploy \
	git checkout master \
	mv _site ../lenciel.github.io.new && rm -rf ../lenciel.github.io
	mv ../lenciel.github.io.new ../lenciel.github.io
	git add .; \
	git commit -am "blog content update $$(date +%Y-%m-%d)"; \
	git push origin master
