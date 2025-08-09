#!/bin/bash

echo "🚀 Simple ChatKaro Deployment to GCP..."

# Generate unique project ID
TIMESTAMP=$(date +%s)
PROJECT_ID="chatkaro-${TIMESTAMP}"

echo "📋 Using project ID: $PROJECT_ID"

# Kill any local servers
pkill -f "node.*index" 2>/dev/null || true
pkill -f nodemon 2>/dev/null || true

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found!"
    echo "📥 Please install it first:"
    echo "   curl https://sdk.cloud.google.com | bash"
    echo "   exec -l \$SHELL"
    exit 1
fi

# Authenticate if needed
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate first:"
    echo "   gcloud auth login"
    exit 1
fi

echo "🆕 Creating new project: $PROJECT_ID"
gcloud projects create $PROJECT_ID

echo "🔧 Setting project..."
gcloud config set project $PROJECT_ID

echo "💳 IMPORTANT: Please enable billing for this project:"
echo "   https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
echo ""
read -p "✅ Press Enter after enabling billing..."

echo "🔧 Enabling required APIs..."
gcloud services enable appengine.googleapis.com

echo "🏗️ Creating App Engine application..."
gcloud app create --region=us-central1

echo "📦 Building client..."
cd client
npm run build
cd ..

echo "🚀 Deploying to App Engine..."
gcloud app deploy --quiet

echo ""
echo "🎉 ============================================"
echo "✅ Deployment Complete!"
echo "🎉 ============================================"
echo ""
echo "🌍 Your app is live at:"
echo "   https://$PROJECT_ID.appspot.com"
echo ""
echo "📊 GCP Console:"
echo "   https://console.cloud.google.com/appengine?project=$PROJECT_ID"
echo ""

# Open browser
gcloud app browse
