# 🚀 ChatKaro - GCP Deployment Guide

This guide will help you deploy the ChatKaro application to Google Cloud Platform (GCP).

## 📋 Prerequisites

1. **Google Cloud Account**: Create one at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud Project**: Create a new project in the GCP Console
3. **Google Cloud CLI**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install)
4. **Node.js**: Version 18+ installed locally

## 🛠️ Setup Steps

### 1. Install Google Cloud CLI

**macOS:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download and run the installer from the Google Cloud website.

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. Authenticate with Google Cloud

```bash
gcloud auth login
```

### 3. Create and Configure Project

```bash
# Create a new project (replace YOUR_PROJECT_ID)
gcloud projects create YOUR_PROJECT_ID

# Set the project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable appengine.googleapis.com
```

### 4. Initialize App Engine

```bash
gcloud app create --region=us-central1
```

## 🚀 Deployment Options

### Option 1: Automated Deployment (Recommended)

Run the deployment script:

```bash
./deploy.sh
```

This script will:
- Check for gcloud CLI installation
- Authenticate if needed
- Build the React client
- Deploy to Google App Engine
- Provide the live URL

### Option 2: Manual Deployment

1. **Build the client:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Deploy to App Engine:**
   ```bash
   gcloud app deploy
   ```

3. **Open the deployed app:**
   ```bash
   gcloud app browse
   ```

## 📁 Deployment Files

- **`app.yaml`**: App Engine configuration
- **`Dockerfile`**: Container configuration (alternative deployment)
- **`.gcloudignore`**: Files to exclude from deployment
- **`deploy.sh`**: Automated deployment script

## 🌐 Features in Production

### ✅ What's Included:
- **Real-time chat** with Socket.IO
- **Multiple chat rooms** (16 default rooms)
- **URL-based persistence** (refresh-proof sessions)
- **Responsive design** for mobile/desktop
- **Auto-scaling** with Google App Engine
- **Health checks** for reliability
- **Session affinity** for WebSocket connections

### 🔧 Configuration:
- **Port**: 8080 (App Engine default)
- **Scaling**: F2 instances, 1-10 auto-scaling
- **Health checks**: `/health` endpoint
- **Session persistence**: URL parameters

## 📊 Monitoring

### View Logs:
```bash
gcloud app logs tail -s default
```

### Check App Status:
```bash
gcloud app describe
```

### View Metrics:
Visit the [GCP Console](https://console.cloud.google.com) → App Engine → Services

## 💰 Cost Estimation

**Google App Engine (F2 instances):**
- **Free tier**: 28 instance hours/day
- **Paid usage**: ~$0.10/hour per instance
- **Typical cost**: $5-20/month for moderate usage

## 🔧 Customization

### Environment Variables:
Edit `app.yaml` to add custom environment variables:

```yaml
env_variables:
  NODE_ENV: production
  CUSTOM_VAR: your_value
```

### Scaling Configuration:
Modify `app.yaml` scaling settings:

```yaml
automatic_scaling:
  min_instances: 2
  max_instances: 20
  target_cpu_utilization: 0.8
```

## 🐛 Troubleshooting

### Common Issues:

1. **"gcloud not found"**
   - Install Google Cloud CLI
   - Restart terminal

2. **"Project not found"**
   - Verify project ID
   - Check billing is enabled

3. **"App Engine region not set"**
   ```bash
   gcloud app create --region=us-central1
   ```

4. **WebSocket connection issues**
   - Check App Engine allows WebSocket connections
   - Verify session affinity is enabled

### Debug Commands:
```bash
# Check deployment status
gcloud app versions list

# View recent logs
gcloud app logs tail -s default

# Check app configuration
gcloud app describe
```

## 🔗 URLs

After deployment, your app will be available at:
- **Live URL**: `https://YOUR_PROJECT_ID.appspot.com`
- **Admin Console**: [console.cloud.google.com](https://console.cloud.google.com)

## 🎯 Next Steps

1. **Custom Domain**: Set up a custom domain in App Engine settings
2. **SSL Certificate**: Automatically provided by Google
3. **CDN**: Enable Cloud CDN for better performance
4. **Monitoring**: Set up Cloud Monitoring alerts
5. **Backup**: Configure regular backups if needed

## 📞 Support

- **Google Cloud Documentation**: [cloud.google.com/docs](https://cloud.google.com/docs)
- **App Engine Guide**: [cloud.google.com/appengine/docs](https://cloud.google.com/appengine/docs)
- **Socket.IO on App Engine**: [cloud.google.com/appengine/docs/flexible/nodejs/using-websockets-and-session-affinity](https://cloud.google.com/appengine/docs/flexible/nodejs/using-websockets-and-session-affinity)

---

🎉 **Your ChatKaro app is now ready for the world!** 🌍
