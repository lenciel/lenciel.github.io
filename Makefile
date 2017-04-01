all: update

preview:
	rake preview

update_source:
	git add .; \
	git commit -am "blog source update $$(date +%Y-%m-%d)"; \
	git push origin source

update_source:
	rake gen_deploy && \
	git add .; \
	git commit -am "blog source update $$(date +%Y-%m-%d)"; \
	git push origin source
