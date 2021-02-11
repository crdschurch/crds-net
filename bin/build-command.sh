#!/bin/bash
# Ships logs to logz.io
{
  bundle exec jekyll contentful --sites www.crossroads.net -f &&
  bundle exec rspec ./vendor ./spec &&
  bundle exec jekyll build --trace --update-search-index &&
  find . -type f -name "*html" -print0 | xargs -0 sed -i '' -E 's/\/\/images.ctfassets.net\/y3a9myzsdjan/\/\/crds-media.imgix.net/g' &&
  bundle exec ruby ./lib/crds/monetate.rb &&
  ./bin/prerenderio-bust.sh &&
  ./bin/kickOffCypress.sh
} 2>&1 | tee buildlog.txt
./bin/logzio.sh
