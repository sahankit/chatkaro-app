#!/bin/bash

# Setup script for automatic Git synchronization
# This sets up file watching and auto-sync for the chatkaro-app

echo "🛠️  Setting up auto-sync for chatkaro-app..."

# Check if fswatch is installed (for macOS)
if ! command -v fswatch &> /dev/null; then
    echo "📦 Installing fswatch for file monitoring..."
    if command -v brew &> /dev/null; then
        brew install fswatch
    else
        echo "❌ Homebrew not found. Please install fswatch manually:"
        echo "   brew install fswatch"
        exit 1
    fi
fi

# Create the watcher script
cat > watch-and-sync.sh << 'EOF'
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
EOF

chmod +x watch-and-sync.sh

echo "✅ Auto-sync setup complete!"
echo ""
echo "📋 Available commands:"
echo "   ./auto-sync.sh         - Manual sync (commit & push changes)"
echo "   ./watch-and-sync.sh    - Start automatic file watching"
echo ""
echo "🚀 To start auto-sync now: ./watch-and-sync.sh"
