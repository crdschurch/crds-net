#!/bin/bash
# Ships logs to logz.io

{
  bundle exec rspec &&
  ./bin/contentful-redirects &&
  ./bin/netlify-redirector &&
  bundle exec jekyll crds &&
  bundle exec jekyll contentful -f &&
  bundle exec jekyll build -t -- --update-search-index &&
  bash ./cypress/kickOffCypress.sh &&
  ./bin/prerenderio-bust.sh &&
  ./bin/health-check.sh "we are crossroads"
} 2>buildlog.txt
./bin/logzio.sh
