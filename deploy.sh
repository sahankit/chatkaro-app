#!/bin/bash

echo "🚀 Deploying ChatKaro to Google Cloud Platform..."

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud:"
    gcloud auth login
fi

# Set project (replace with your project ID)
read -p "Enter your Google Cloud Project ID: " PROJECT_ID
gcloud config set project $PROJECT_ID

echo "📦 Building client application..."
cd client
npm run build
cd ..

echo "🌐 Deploying to Google App Engine..."
gcloud app deploy --quiet

echo "✅ Deployment complete!"
echo "🌍 Your chat app is now live at: https://$PROJECT_ID.appspot.com"

# Open the deployed app
read -p "Open the app in browser? (y/n): " OPEN_APP
if [[ $OPEN_APP == "y" || $OPEN_APP == "Y" ]]; then
    gcloud app browse
fi
