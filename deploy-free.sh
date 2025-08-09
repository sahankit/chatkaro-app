#!/bin/bash

echo "🚀 Deploying ChatKaro Backend for FREE..."

# Create a simple deployment package
mkdir -p deploy-package
cp server/index.js deploy-package/
cp server/package.json deploy-package/

echo "📦 Deployment package created in 'deploy-package/' folder"
echo ""
echo "🎯 QUICK DEPLOY OPTIONS:"
echo ""
echo "1. GLITCH (Easiest - 2 minutes):"
echo "   - Go to: https://glitch.com"
echo "   - New Project → Import from GitHub"
echo "   - Upload the files from 'deploy-package/' folder"
echo "   - Click 'Show' to get your URL"
echo ""
echo "2. RENDER (Most Reliable):"
echo "   - Go to: https://dashboard.render.com"
echo "   - New Web Service → Upload files"
echo "   - Upload 'deploy-package/' folder"
echo "   - Build: npm install"
echo "   - Start: npm start"
echo ""
echo "3. CODESANDBOX (Instant):"
echo "   - Go to: https://codesandbox.io"
echo "   - New → Node.js"
echo "   - Upload files from 'deploy-package/'"
echo "   - Click Run"
echo ""
echo "✨ I'll use your backend URL to connect the client!"
echo "📋 Just give me the URL once it's deployed."