all: update

prepare:
	rake prepare_deploy

preview:
	rake preview

update_source:
	git checkout source \
	git pull \
	git add .; \
	git commit -am "blog source update $$(date +%Y-%m-%d)"; \
	git push origin source

update_blog:
	git checkout master && mv _site .site && rm -rf * && mv .site/* . && rm -rf .site \
	git add .; \
	git commit -am "Update blog content update $$(date +%Y-%m-%d)"; \
	git push origin master
