# 🔄 Auto-Deploy Setup with GitHub Actions

This guide will set up automatic deployment to GCP whenever you push code to GitHub.

## 🚀 Quick Deploy (Right Now)

**Deploy immediately without GitHub:**

```bash
./quick-deploy.sh
```

This script will:
- ✅ Install Google Cloud CLI (if needed)
- ✅ Authenticate with Google Cloud
- ✅ Create/configure your GCP project
- ✅ Build and deploy your app
- ✅ Provide the live URL

## 🔄 Auto-Deploy Setup (GitHub Actions)

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: ChatKaro app"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/chatkaro.git
git branch -M main
git push -u origin main
```

### Step 2: Create Google Cloud Service Account

1. **Go to GCP Console**: [console.cloud.google.com](https://console.cloud.google.com)

2. **Create Service Account**:
   ```bash
   # Or use CLI
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions"
   ```

3. **Grant Permissions**:
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/appengine.deployer"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/appengine.serviceAdmin"
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   ```

4. **Create Key**:
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

### Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

1. **`GCP_PROJECT_ID`**: Your Google Cloud Project ID
2. **`GCP_SA_KEY`**: Contents of the `key.json` file (entire JSON)

### Step 4: Test Auto-Deploy

Push any change to trigger deployment:

```bash
git add .
git commit -m "Test auto-deploy"
git push
```

## 📋 Available Scripts

```bash
# Quick one-time deployment
./quick-deploy.sh

# Install all dependencies
npm run install-all

# Build client
npm run build

# Deploy manually
npm run gcp-deploy

# Run development mode
npm run dev
```

## 🔍 Monitoring Deployments

### GitHub Actions:
- **View progress**: Repository → Actions tab
- **Check logs**: Click on any workflow run

### Google Cloud:
- **App Engine Console**: [console.cloud.google.com/appengine](https://console.cloud.google.com/appengine)
- **View logs**: `gcloud app logs tail -s default`
- **Check versions**: `gcloud app versions list`

## 🎯 Deployment Triggers

**Auto-deploy triggers on:**
- ✅ Push to `main` branch
- ✅ Push to `master` branch
- ✅ Pull request to main/master

**Manual deploy:**
- ✅ Run `./quick-deploy.sh`
- ✅ Run `npm run gcp-deploy`

## 🔧 Customizing Auto-Deploy

Edit `.github/workflows/deploy.yml` to:

- **Change trigger branches**:
  ```yaml
  on:
    push:
      branches: [ main, develop, production ]
  ```

- **Add environment variables**:
  ```yaml
  env:
    NODE_ENV: production
    CUSTOM_VAR: ${{ secrets.CUSTOM_VAR }}
  ```

- **Add testing before deploy**:
  ```yaml
  - name: Run tests
    run: |
      cd server && npm test
      cd ../client && npm test
  ```

## 🚨 Troubleshooting

### Common Issues:

1. **"Service account key invalid"**
   - Regenerate the key.json file
   - Update GitHub secret `GCP_SA_KEY`

2. **"Permission denied"**
   - Check service account roles
   - Verify project ID is correct

3. **"App Engine not initialized"**
   - Run: `gcloud app create --region=us-central1`

4. **"Build failed"**
   - Check Node.js version compatibility
   - Verify all dependencies are listed

### Debug Commands:

```bash
# Check deployment status
gcloud app versions list

# View detailed logs
gcloud app logs tail -s default --level=info

# Check service account
gcloud iam service-accounts list

# Test authentication
gcloud auth list
```

## 🎉 Success!

Once set up, your ChatKaro app will automatically deploy to GCP every time you push code! 

**Live URL**: `https://YOUR_PROJECT_ID.appspot.com`

Your chat app features:
- ✅ Real-time messaging
- ✅ URL-based persistence
- ✅ 16 chat rooms
- ✅ Mobile responsive
- ✅ Auto-scaling
- ✅ Continuous deployment
