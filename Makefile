npm_bin = $(shell npm bin)

lint:
	@$(npm_bin)/jshint .
