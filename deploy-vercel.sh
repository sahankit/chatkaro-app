#!/bin/bash

echo "🚀 Deploying ChatKaro to Vercel (Free & Easy)..."

# Kill local servers
pkill -f "node.*index" 2>/dev/null || true
pkill -f nodemon 2>/dev/null || true

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found! Please install Node.js first."
    exit 1
fi

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build client
echo "📦 Building React client..."
cd client
npm install
npm run build
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 ============================================"
echo "✅ Vercel Deployment Complete!"
echo "🎉 ============================================"
echo ""
echo "🌍 Your ChatKaro app is now live!"
echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "✨ Features:"
echo "   ✅ Free hosting"
echo "   ✅ Automatic HTTPS"
echo "   ✅ Global CDN"
echo "   ✅ Auto-deploy on git push"
echo ""
echo "🔗 To set up auto-deploy:"
echo "   1. Push code to GitHub"
echo "   2. Connect repository in Vercel dashboard"
echo "   3. Every push will auto-deploy!"
echo ""
