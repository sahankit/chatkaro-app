#!/bin/bash

echo "🚀 Deploying ChatKaro Backend to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for ChatKaro backend deployment"
fi

echo "📋 Render Deployment Instructions:"
echo ""
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository or use 'Public Git Repository'"
echo "4. If using Public Git Repository, enter this URL:"
echo "   (First push your code to GitHub)"
echo ""
echo "5. Configuration:"
echo "   - Name: chatkaro-backend"
echo "   - Environment: Node"
echo "   - Build Command: cd server && npm install"
echo "   - Start Command: cd server && npm start"
echo "   - Plan: Free"
echo ""
echo "6. Environment Variables:"
echo "   - NODE_ENV = production"
echo "   - PORT = 10000"
echo ""
echo "7. Click 'Deploy Web Service'"
echo ""
echo "📝 Alternative: Push to GitHub first:"
echo "git remote add origin https://github.com/YOUR_USERNAME/chatkaro.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "Then connect the GitHub repo in Render dashboard."

# Make the script executable
chmod +x "$0"
