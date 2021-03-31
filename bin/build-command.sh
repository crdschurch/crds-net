#!/bin/bash
# Ships logs to logz.io
{
  bundle exec jekyll contentful --sites www.crossroads.net -f &&
  bundle exec jekyll build --incremental &&
  ./bin/prerenderio-bust.sh &&
  ./bin/kickOffCypress.sh
} 2>buildlog.txt
./bin/logzio.sh
