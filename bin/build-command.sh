#!/bin/bash
# Ships logs to logz.io
{
  bundle exec jekyll contentful --sites www.crossroads.net -f &&
  bundle exec jekyll build -- --update-search-index &&
  # ./bin/prerenderio-bust.sh &&
  ./bin/kickOffCypress.sh &&
  ./bin/adjustCrossroadsOnlineCanonicalURL.sh
} 2>buildlog.txt
