#!/bin/bash

replace_image_urls() {
  local file="$1"

  if [[ "$file" =~ \.html$ ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # Replace image domain and update the path format
      sed -E -i '' -e 's#(https?:)?//images\.ctfassets\.net/[^/]+/([^/]+)/([^/]+)/([^/#?]+(\.png|\.PNG|\.jpe?g|\.JPE?G))#https://crds-media.imgix.net/\2/\3/\4#g' "$file"
      # Correctly append auto=compress based on whether the URL already has query parameters
      sed -E -i '' -e 's#(https?://crds-media\.imgix\.net/[^"'\'']*)(\?[^"'\'' ]*)?(['\'')])#\1\2\3&auto=compress#g' -e 's#(&auto=compress)(\?[^"'\'' ]*)#?auto=compress\2#g' "$file"
    else
      # Replace image domain and update the path format
      sed -E -i -e 's#(https?:)?//images\.ctfassets\.net/[^/]+/([^/]+)/([^/]+)/([^/#?]+(\.png|\.PNG|\.jpe?g|\.JPE?G))#https://crds-media.imgix.net/\2/\3/\4#g' "$file"
      # Correctly append auto=compress based on whether the URL already has query parameters
      sed -E -i -e 's#(https?://crds-media\.imgix\.net/[^"'\'']*)(\?[^"'\'' ]*)?(['\'')])#\1\2\3&auto=compress#g' -e 's#(&auto=compress)(\?[^"'\'' ]*)#?auto=compress\2#g' "$file"
    fi
  fi
}

site_directory="_site"

find "$site_directory" -type f -name "*.html" | while read -r file; do
  replace_image_urls "$file"
done