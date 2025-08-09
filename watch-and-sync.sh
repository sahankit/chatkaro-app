#!/bin/bash

echo "👀 Starting file watcher for auto-sync..."
echo "📁 Monitoring: client/src/, server/, *.md, *.json, *.yaml, *.toml"
echo "🔄 Changes will be automatically committed and pushed to GitHub"
echo "⏹️  Press Ctrl+C to stop"

# Watch for changes in important directories and files
fswatch -o \
  client/src/ \
  server/ \
  *.md \
  *.json \
  *.yaml \
  *.toml \
  *.sh \
  | while read num; do
    echo "📝 File changes detected at $(date)"
    sleep 2  # Wait a moment to ensure all changes are written
    ./auto-sync.sh
  done
