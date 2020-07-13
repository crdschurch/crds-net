#!/bin/bash

## Set host to first argument (needed for Docker). Defaults to localhost if empty.
[ "$1" ] && HOST="$1" || HOST=127.0.0.1
echo "Host $HOST"

## Build crds-net with Contentful assets & serve locally
echo "Starting local serve" &&
bundle exec jekyll crds &&
bundle exec jekyll contentful &&
bundle exec jekyll serve --force_polling --host $HOST