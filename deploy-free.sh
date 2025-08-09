#!/bin/bash

echo "🎉 Free Server Deployment Options for ChatKaro"
echo "=============================================="
echo ""
echo "Choose a free hosting platform:"
echo ""
echo "1) 🚀 Vercel (Recommended - Easy & Fast)"
echo "   ✅ Free forever"
echo "   ✅ Instant deployment"
echo "   ✅ Auto HTTPS"
echo "   ✅ Global CDN"
echo ""
echo "2) 🔥 Netlify (Great for static sites)"
echo "   ✅ Free tier generous"
echo "   ✅ Easy deployment"
echo "   ✅ Form handling"
echo ""
echo "3) 🐙 GitHub Pages + Surge.sh"
echo "   ✅ Completely free"
echo "   ✅ GitHub integration"
echo "   ✅ Custom domains"
echo ""
echo "4) 🌐 Railway (Full-stack friendly)"
echo "   ✅ Free tier available"
echo "   ✅ Database support"
echo "   ✅ Easy scaling"
echo ""
echo "5) ⚡ Render (Modern platform)"
echo "   ✅ Free tier"
echo "   ✅ Auto-deploy from git"
echo "   ✅ Full-stack support"
echo ""

read -p "Enter your choice (1-5): " PLATFORM_CHOICE

case $PLATFORM_CHOICE in
    1)
        echo "🚀 Deploying to Vercel..."
        ./deploy-vercel.sh
        ;;
    2)
        echo "🔥 Deploying to Netlify..."
        ./deploy-netlify.sh
        ;;
    3)
        echo "🐙 Deploying to GitHub Pages + Surge..."
        ./deploy-github-surge.sh
        ;;
    4)
        echo "🌐 Deploying to Railway..."
        ./deploy-railway.sh
        ;;
    5)
        echo "⚡ Deploying to Render..."
        ./deploy-render.sh
        ;;
    *)
        echo "❌ Invalid choice"
        echo "💡 Tip: Try option 1 (Vercel) - it's the easiest!"
        exit 1
        ;;
esac
