#!/bin/bash

echo "🚀 Quick Deploy ChatKaro to GCP..."

# Kill any local servers
echo "🔄 Stopping local servers..."
pkill -f "node.*index" 2>/dev/null || true
pkill -f nodemon 2>/dev/null || true

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found!"
    echo "📥 Installing Google Cloud CLI..."
    
    # Install gcloud CLI
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        curl https://sdk.cloud.google.com | bash
        exec -l $SHELL
    else
        echo "Please install Google Cloud CLI manually: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
fi

# Check authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Authenticating with Google Cloud..."
    gcloud auth login
fi

# Set project
echo "📋 Setting up project..."
read -p "Enter your Google Cloud Project ID (or press Enter for 'chatkaro-app'): " PROJECT_ID
PROJECT_ID=${PROJECT_ID:-chatkaro-app}

# Create project if it doesn't exist
if ! gcloud projects describe $PROJECT_ID &>/dev/null; then
    echo "🆕 Creating new project: $PROJECT_ID"
    gcloud projects create $PROJECT_ID
    echo "💳 Please enable billing for this project in the GCP Console:"
    echo "   https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
    read -p "Press Enter after enabling billing..."
fi

gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable appengine.googleapis.com

# Initialize App Engine if needed
if ! gcloud app describe &>/dev/null; then
    echo "🏗️ Initializing App Engine..."
    gcloud app create --region=us-central1
fi

# Build client
echo "📦 Building React client..."
cd client
npm install
npm run build
cd ..

# Deploy
echo "🚀 Deploying to Google App Engine..."
gcloud app deploy --quiet

# Get the URL
APP_URL=$(gcloud app browse --no-launch-browser 2>&1 | grep -o 'https://[^[:space:]]*')

echo ""
echo "🎉 ============================================"
echo "✅ Deployment Successful!"
echo "🎉 ============================================"
echo ""
echo "🌍 Your ChatKaro app is live at:"
echo "   $APP_URL"
echo ""
echo "📊 Monitor your app:"
echo "   https://console.cloud.google.com/appengine?project=$PROJECT_ID"
echo ""
echo "📝 View logs:"
echo "   gcloud app logs tail -s default"
echo ""

# Open in browser
read -p "🌐 Open the app in browser? (y/n): " OPEN_APP
if [[ $OPEN_APP == "y" || $OPEN_APP == "Y" ]]; then
    gcloud app browse
fi

echo "🎯 Setup complete! Your chat app is now live on GCP!"
