#!/bin/bash

replace_image_urls() {
  local file="$1"

  if [[ "$file" =~ \.html$ ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -E -i '' -e 's#(https?:)?//images\.ctfassets\.net/[^/]+/([^/]+)/([^/]+)/([^/#?]+(\.png|\.PNG|\.jpe?g|\.JPE?G))#https://crds-media.imgix.net/\2/\3/\4#g' "$file"
      sed -E -i '' -e 's#(https?://crds-media\.imgix\.net/[^"]+)#\1?auto=compress#g' "$file"
    else
      sed -E -i -e 's#(https?:)?//images\.ctfassets\.net/[^/]+/([^/]+)/([^/]+)/([^/#?]+(\.png|\.PNG|\.jpe?g|\.JPE?G))#https://crds-media.imgix.net/\2/\3/\4#g' "$file"
      sed -E -i -e 's#(https?://crds-media\.imgix\.net/[^"]+)#\1?auto=compress#g' "$file"
    fi
  fi
}

site_directory="_site"

find "$site_directory" -type f -name "*.html" | while read -r file; do
  replace_image_urls "$file"
done