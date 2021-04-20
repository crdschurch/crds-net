#!/bin/bash
# Ships logs to logz.io

{
  bundle exec rspec &&
  bundle exec jekyll contentful --sites www.crossroads.net -f &&
  bundle exec jekyll build -- --update-search-index &&
  ./bin/prerenderio-bust.sh &&
  ./bin/kickOffCypress.sh
} 2>buildlog.txt
./bin/logzio.sh
