#!/bin/bash

startedAt=$(date +'%s')
echo "=========================================="
echo "  Contentful Start: $(date +'%r')"
echo "=========================================="
echo ""
bundle exec jekyll contentful --sites www.crossroads.net -f
endedAt=$(date +'%s')
timeDiff="$(($endedAt-$startedAt))"
echo ""
echo "=========================================="
echo "  Contentful End: $(date +'%r')"
echo "  Duration (Seconds): ~$timeDiff"
echo "=========================================="
