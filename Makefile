npm_bin = $(shell npm bin)

lint:
	@$(npm_bin)/jshint --verbose .

install:
	npm install .

server:
	node app.js
