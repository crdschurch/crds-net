#!/bin/bash
# Ships logs to logz.io

{
  bundle exec rspec &&
  ./bin/contentful-redirects &&
  ./bin/netlify-redirector &&
  bundle exec jekyll crds &&
  bundle exec jekyll contentful --sites www.crossroads.net -f &&
  bundle exec jekyll build -- --update-search-index &&
  find . -type f -name "*html" -print0 | xargs -0 sed -i '' -E 's/\/\/images.ctfassets.net\/y3a9myzsdjan/\/\/crds-media.imgix.net/g' &&
  ./bin/prerenderio-bust.sh &&
  ./bin/health-check.sh "we are crossroads" &&
  ./bin/kickOffCypress.sh
} 2>buildlog.txt
./bin/logzio.sh
