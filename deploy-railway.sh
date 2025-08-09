#!/bin/bash

echo "🌐 Deploying ChatKaro to Railway..."

# Install Railway CLI if not present
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Build the client
echo "📦 Building React client..."
cd client
npm install
npm run build
cd ..

# Create railway.json for configuration
cat > railway.json << EOF
{
  "\$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "node server/index.js",
    "healthcheckPath": "/health"
  }
}
EOF

# Create Procfile for Railway
echo "web: node server/index.js" > Procfile

echo "🔐 Logging into Railway..."
if ! railway login; then
    echo "❌ Railway login failed"
    exit 1
fi

echo "🏗️ Creating new Railway project..."
railway login
railway link

echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "🎉 ============================================"
echo "✅ Railway Deployment Complete!"
echo "🎉 ============================================"
echo ""
echo "🌍 Your ChatKaro app is live!"
echo "📊 Railway Dashboard: https://railway.app/dashboard"
echo ""
echo "✨ Railway Features:"
echo "   ✅ Full Socket.IO support"
echo "   ✅ Real-time chat works perfectly"
echo "   ✅ Auto-deploy from GitHub"
echo "   ✅ Free tier: 500 hours/month"
echo "   ✅ Custom domains"
echo ""
echo "🔗 To set up auto-deploy:"
echo "   1. Push code to GitHub"
echo "   2. Connect repo in Railway dashboard"
echo "   3. Auto-deploy on git push!"
echo ""

# Get the deployment URL
RAILWAY_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
if [ ! -z "$RAILWAY_URL" ]; then
    echo "🌍 Live URL: $RAILWAY_URL"
    echo ""
    read -p "🌐 Open the app in browser? (y/n): " OPEN_APP
    if [[ $OPEN_APP == "y" || $OPEN_APP == "Y" ]]; then
        open "$RAILWAY_URL"
    fi
fi

echo "🎯 Railway deployment complete!"
