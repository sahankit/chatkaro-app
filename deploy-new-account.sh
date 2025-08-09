#!/bin/bash

echo "🔄 Switching to Different GCP Account & Deploying..."

# Kill any local servers
pkill -f "node.*index" 2>/dev/null || true
pkill -f nodemon 2>/dev/null || true

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found!"
    echo "📥 Installing Google Cloud CLI..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        curl https://sdk.cloud.google.com | bash
        exec -l $SHELL
    else
        echo "Please install Google Cloud CLI: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
fi

echo "👤 Current authenticated accounts:"
gcloud auth list

echo ""
echo "🔐 Choose authentication option:"
echo "1) Login with new account"
echo "2) Switch to existing account"
echo "3) Use service account key"
read -p "Enter choice (1-3): " AUTH_CHOICE

case $AUTH_CHOICE in
    1)
        echo "🔐 Logging in with new account..."
        gcloud auth login
        ;;
    2)
        echo "📋 Available accounts:"
        gcloud auth list --format="value(account)"
        read -p "Enter email of account to use: " ACCOUNT_EMAIL
        gcloud config set account $ACCOUNT_EMAIL
        ;;
    3)
        read -p "Enter path to service account key file: " KEY_FILE
        gcloud auth activate-service-account --key-file="$KEY_FILE"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Current active account:"
gcloud auth list --filter=status:ACTIVE --format="value(account)"

# Generate unique project ID
TIMESTAMP=$(date +%s)
DEFAULT_PROJECT="chatkaro-${TIMESTAMP}"

echo ""
echo "📋 Project setup:"
echo "1) Create new project"
echo "2) Use existing project"
read -p "Enter choice (1-2): " PROJECT_CHOICE

case $PROJECT_CHOICE in
    1)
        read -p "Enter project ID (or press Enter for '$DEFAULT_PROJECT'): " PROJECT_ID
        PROJECT_ID=${PROJECT_ID:-$DEFAULT_PROJECT}
        
        echo "🆕 Creating project: $PROJECT_ID"
        if gcloud projects create $PROJECT_ID; then
            echo "✅ Project created successfully"
        else
            echo "❌ Project creation failed. It might already exist."
            read -p "Continue with existing project? (y/n): " CONTINUE
            if [[ $CONTINUE != "y" && $CONTINUE != "Y" ]]; then
                exit 1
            fi
        fi
        ;;
    2)
        echo "📋 Your accessible projects:"
        gcloud projects list --format="table(projectId,name,lifecycleState)"
        read -p "Enter project ID to use: " PROJECT_ID
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "🔧 Setting active project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "💳 BILLING SETUP REQUIRED:"
echo "   Please enable billing for this project at:"
echo "   https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
echo ""
read -p "✅ Press Enter after enabling billing..."

echo "🔧 Enabling required APIs..."
if ! gcloud services enable appengine.googleapis.com; then
    echo "❌ Failed to enable App Engine API. Check billing and permissions."
    exit 1
fi

echo "🏗️ Setting up App Engine..."
if ! gcloud app describe &>/dev/null; then
    echo "Creating new App Engine application..."
    if ! gcloud app create --region=us-central1; then
        echo "❌ Failed to create App Engine app. Check permissions."
        exit 1
    fi
else
    echo "✅ App Engine already exists"
fi

echo "📦 Building React client..."
cd client
if ! npm install; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

if ! npm run build; then
    echo "❌ Failed to build client"
    exit 1
fi
cd ..

echo "🚀 Deploying to Google App Engine..."
if gcloud app deploy --quiet; then
    APP_URL="https://$PROJECT_ID.appspot.com"
    
    echo ""
    echo "🎉 ============================================"
    echo "✅ Deployment Successful!"
    echo "🎉 ============================================"
    echo ""
    echo "🌍 Your ChatKaro app is live at:"
    echo "   $APP_URL"
    echo ""
    echo "📊 GCP Console:"
    echo "   https://console.cloud.google.com/appengine?project=$PROJECT_ID"
    echo ""
    echo "📝 View logs:"
    echo "   gcloud app logs tail -s default"
    echo ""
    echo "👤 Deployed with account:"
    gcloud config get-value account
    echo ""
    
    read -p "🌐 Open the app in browser? (y/n): " OPEN_APP
    if [[ $OPEN_APP == "y" || $OPEN_APP == "Y" ]]; then
        gcloud app browse
    fi
    
    echo "🎯 Deployment complete! Your chat app is live!"
else
    echo "❌ Deployment failed. Check the errors above."
    echo "💡 Common solutions:"
    echo "   - Ensure billing is enabled"
    echo "   - Check account has App Engine Admin role"
    echo "   - Verify project permissions"
    exit 1
fi
