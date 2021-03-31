#!/bin/bash

grep -rl --exclude=\*.sh --exclude-dir=./.bundle --exclude-dir=./.jekyll-cache "ga('" . | xargs sed -i "s/ga('/abstractedAnalytics('/g"
