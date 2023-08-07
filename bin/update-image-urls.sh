#!/bin/bash

replace_image_urls() {
  local file="$1"

  if [[ "$file" =~ \.html$ ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
      if ! sed -E -i '' -e 's#(https?:)?//images\.ctfassets\.net/[^/]+/([^/]+)/([^/]+)/([^/]+)#https://crds-media.imgix.net/\2/\3/\4#g' "$file"; then
        echo "Error updating image URLs in: $file"
      fi
    else
      if ! sed -E -i -e 's#(https?:)?//images\.ctfassets\.net/[^/]+/([^/]+)/([^/]+)/([^/]+)#https://crds-media.imgix.net/\2/\3/\4#g' "$file"; then
        echo "Error updating image URLs in: $file"
      fi
    fi
  fi
}

site_directory="_site"

find "$site_directory" -type f -name "*.html" | while read -r file; do
  replace_image_urls "$file"
done
