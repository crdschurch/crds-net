#!/bin/bash
# Ships logs to logz.io

{
  bundle exec rspec &&
  ./bin/contentful-redirects &&
  ./bin/netlify-redirector &&
  bundle exec jekyll crds &&
  bundle exec jekyll contentful -f &&
  bundle exec jekyll build -- --update-search-index &&
  bash ./cypress/kickOffCypress.sh &&
  ./bin/health-check.sh "we are crossroads"
} 2>&1 | tee buildlog.txt
./bin/logzio.sh
