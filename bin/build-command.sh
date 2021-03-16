#!/bin/bash
# Ships logs to logz.io
{
  bundle exec jekyll contentful --sites www.crossroads.net -f &&
  bundle exec jekyll build &&
  find ./_site -type f -name "*html" -print0 | xargs -0 sed -i '' -E 's/\/\/images.ctfassets.net\/y3a9myzsdjan/\/\/crds-media.imgix.net/g' 
}
