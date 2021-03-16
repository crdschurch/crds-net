#!/bin/bash
# Ships logs to logz.io
{
  bundle exec jekyll contentful --sites www.crossroads.net -f &&
  bundle exec jekyll build &&
}
