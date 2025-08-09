#!/bin/bash

# Auto-sync script for chatkaro-app
# This script automatically commits and pushes changes to GitHub

echo "🔄 Auto-sync starting..."

# Check if there are any changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Changes detected, committing..."
    
    # Add all changes (excluding build files and cache)
    git add client/src/ server/ *.md *.json *.yaml *.toml *.sh
    
    # Commit with timestamp
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    git commit -m "Auto-sync: Updates from $TIMESTAMP

- Automatic commit of latest changes
- Timestamp: $TIMESTAMP"
    
    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Auto-sync completed successfully!"
    else
        echo "❌ Push failed. Please check your connection and authentication."
    fi
else
    echo "✨ No changes to sync."
fi

echo "🔄 Auto-sync finished."
