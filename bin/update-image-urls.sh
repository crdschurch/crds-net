#!/bin/bash

replace_image_urls() {
  local file="$1"
  local search_pattern="//images\.ctfassets\.net/[^/]+/\(.*\)/\(.*\)/\(.*\)/\(.*\)\.\(jpg\|jpeg\|png\)"
  local replacement="https://crds-media.imgix.net/\2/\3/\4.\5"

  sed -E -i "s|$search_pattern|$replacement|g" "$file"
}

site_directory="_site"

find "$site_directory" -type f -name "*.html" | while read -r file; do
  replace_image_urls "$file"
done