#!/bin/bash

echo "🔄 Google Cloud Account Switcher"
echo "================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found!"
    echo "📥 Install it first: curl https://sdk.cloud.google.com | bash"
    exit 1
fi

echo ""
echo "👤 Currently authenticated accounts:"
gcloud auth list

echo ""
echo "🔐 Choose an option:"
echo "1) Add new account (login)"
echo "2) Switch to existing account"
echo "3) Use service account key file"
echo "4) Show current configuration"
echo "5) Revoke account access"

read -p "Enter choice (1-5): " CHOICE

case $CHOICE in
    1)
        echo "🔐 Opening browser for new account login..."
        gcloud auth login
        echo "✅ New account added!"
        ;;
    
    2)
        echo ""
        echo "📋 Available accounts:"
        gcloud auth list --format="value(account)" | nl
        echo ""
        read -p "Enter the email address to switch to: " ACCOUNT_EMAIL
        
        if gcloud config set account $ACCOUNT_EMAIL; then
            echo "✅ Switched to: $ACCOUNT_EMAIL"
        else
            echo "❌ Failed to switch account"
            exit 1
        fi
        ;;
    
    3)
        read -p "📁 Enter path to service account key file: " KEY_FILE
        
        if [[ -f "$KEY_FILE" ]]; then
            if gcloud auth activate-service-account --key-file="$KEY_FILE"; then
                echo "✅ Service account activated!"
            else
                echo "❌ Failed to activate service account"
                exit 1
            fi
        else
            echo "❌ Key file not found: $KEY_FILE"
            exit 1
        fi
        ;;
    
    4)
        echo ""
        echo "📊 Current Configuration:"
        echo "========================"
        echo "Active Account: $(gcloud config get-value account)"
        echo "Active Project: $(gcloud config get-value project)"
        echo "Default Region: $(gcloud config get-value compute/region)"
        echo "Default Zone: $(gcloud config get-value compute/zone)"
        echo ""
        echo "All authenticated accounts:"
        gcloud auth list
        ;;
    
    5)
        echo ""
        echo "📋 Accounts to revoke:"
        gcloud auth list --format="value(account)" | nl
        echo ""
        read -p "Enter email address to revoke: " REVOKE_EMAIL
        
        if gcloud auth revoke $REVOKE_EMAIL; then
            echo "✅ Access revoked for: $REVOKE_EMAIL"
        else
            echo "❌ Failed to revoke access"
            exit 1
        fi
        ;;
    
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎯 Current active account:"
echo "   $(gcloud config get-value account)"

echo ""
echo "📋 Available projects for this account:"
gcloud projects list --format="table(projectId,name)" --limit=10

echo ""
echo "💡 Next steps:"
echo "   - To deploy: ./deploy-new-account.sh"
echo "   - To set project: gcloud config set project PROJECT_ID"
echo "   - To check config: gcloud config list"
