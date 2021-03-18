#!/bin/bash

startedAt=$(date +'%s')
echo "=========================================="
echo "  Jekyll Start: $(date +'%r')"
echo "=========================================="
echo ""
bundle exec jekyll build --profile
endedAt=$(date +'%s')
timeDiff="$(($endedAt-$startedAt))"
echo ""
echo "=========================================="
echo "  Jekyll End: $(date +'%r')"
echo "  Duration (Seconds): ~$timeDiff"
echo "=========================================="
