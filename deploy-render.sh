#!/bin/bash

echo "⚡ Deploying ChatKaro to Render..."

# Build the client
echo "📦 Building React client..."
cd client
npm install
npm run build
cd ..

# Create render.yaml for configuration
cat > render.yaml << EOF
services:
  - type: web
    name: chatkaro
    env: node
    plan: free
    buildCommand: cd client && npm install && npm run build && cd ../server && npm install
    startCommand: node server/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /health
EOF

# Update server to use PORT from environment
if ! grep -q "process.env.PORT" server/index.js; then
    sed -i.bak 's/const PORT = process.env.PORT || 5000;/const PORT = process.env.PORT || 10000;/' server/index.js
fi

echo ""
echo "🎯 Render Deployment Setup Complete!"
echo "===================================="
echo ""
echo "📋 Next steps to deploy on Render:"
echo ""
echo "1️⃣  Push your code to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git remote add origin https://github.com/YOUR_USERNAME/chatkaro.git"
echo "   git push -u origin main"
echo ""
echo "2️⃣  Go to Render Dashboard:"
echo "   https://dashboard.render.com"
echo ""
echo "3️⃣  Create New Web Service:"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Select the chatkaro repository"
echo ""
echo "4️⃣  Configure the service:"
echo "   - Name: chatkaro"
echo "   - Environment: Node"
echo "   - Build Command: cd client && npm install && npm run build && cd ../server && npm install"
echo "   - Start Command: node server/index.js"
echo "   - Plan: Free"
echo ""
echo "5️⃣  Deploy!"
echo "   - Click 'Create Web Service'"
echo "   - Wait for deployment (5-10 minutes)"
echo "   - Get your live URL!"
echo ""
echo "✨ Render Features:"
echo "   ✅ Free tier: 750 hours/month"
echo "   ✅ Full Socket.IO support"
echo "   ✅ Auto-deploy from GitHub"
echo "   ✅ Custom domains"
echo "   ✅ Automatic HTTPS"
echo ""
echo "📁 Files created:"
echo "   ✅ render.yaml - Render configuration"
echo "   ✅ Updated server port configuration"
echo ""
echo "🎉 Ready for Render deployment!"
