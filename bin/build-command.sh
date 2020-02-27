#!/bin/bash
# Ships logs to logz.io

{
  bundle exec rspec &&
  ./bin/contentful-redirects &&
  ./bin/netlify-redirector &&
  bundle exec jekyll crds &&
  bundle exec jekyll contentful -f &&
  bundle exec jekyll build &&
  ./bin/prerenderio-bust.sh &&
  ./bin/health-check.sh "we are crossroads" &&
  ./bin/kickOffCypress.sh
} 2>buildlog.txt
./bin/logzio.sh
