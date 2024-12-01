INSTALL_DEPS=node_modules
SRC_FILES=$(shell find src/)

node_modules: package.json
	npm ci
	@if [ -e node_modules ]; then touch node_modules; fi

clean:
	rm -rf node_modules

run: $(INSTALL_DEPS)
	npx --no-install tsx src/main.mts

install: $(INSTALL_DEPS)

test: $(INSTALL_DEPS)
	npx vitest

lint: $(INSTALL_DEPS)
	npx --no-install prettier --check .
	npx --no-install tsc --noEmit
	npx --no-install eslint .

.PHONY: dev install clean lint test
