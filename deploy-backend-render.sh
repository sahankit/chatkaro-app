#!/bin/bash

echo "🚀 ChatKaro Backend Deployment Guide"
echo "===================================="
echo ""
echo "📋 Updated backend repository: https://github.com/sahankit/chatkaro-backend-updated"
echo ""
echo "🔧 Manual Deployment Steps:"
echo ""
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect GitHub: sahankit/chatkaro-backend-updated"
echo "4. Settings:"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Branch: main"
echo "5. Click 'Create Web Service'"
echo ""
echo "⏱️  Deployment usually takes 2-3 minutes"
echo ""
echo "✅ After deployment:"
echo "   - You'll get a URL like: https://your-service-name.onrender.com"
echo "   - Test with: https://your-service-name.onrender.com/health"
echo ""
echo "🔄 Update Frontend:"
echo "   - Update client/src/App.js line 6 with your new backend URL"
echo "   - Rebuild and redeploy to Netlify"
echo ""

# Check if user wants to open browser
read -p "🌐 Open Render dashboard in browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://dashboard.render.com"
        echo "✅ Opened Render dashboard"
    else
        echo "🌐 Please visit: https://dashboard.render.com"
    fi
fi

echo ""
echo "📚 Need help? Check NETLIFY_DEPLOYMENT.md for detailed instructions"
