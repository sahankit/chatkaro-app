# 🚀 Quick Deploy Backend - 3 Minutes Setup

## Option 1: Glitch (Easiest - Recommended)

### Step 1: Go to Glitch
1. Visit: https://glitch.com
2. Click **"New Project"**
3. Select **"Import from GitHub"**

### Step 2: Upload Server Files
If you don't have GitHub, you can:
1. Click **"New Project"** → **"hello-node"**
2. Delete the existing files
3. Upload these files from the `server/` folder:
   - `index.js`
   - `package.json`

### Step 3: Get Your Backend URL
- Your app will be at: `https://YOUR-PROJECT-NAME.glitch.me`
- Example: `https://chatkaro-backend.glitch.me`

---

## Option 2: Render (Also Free)

### Step 1: Create Account
1. Go to: https://dashboard.render.com
2. Sign up with GitHub

### Step 2: Deploy
1. Click **"New +"** → **"Web Service"**
2. Choose **"Public Git Repository"**
3. Enter: `https://github.com/YOUR_USERNAME/chatkaro` (if you have GitHub)
4. Or upload the `server/` folder

### Step 3: Configuration
- **Name**: `chatkaro-backend`
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: `Free`

---

## 📋 What You Need to Copy

From `server/` folder, copy these files:

### `package.json`
```json
{
  "name": "chatkaro-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5",
    "uuid": "^9.0.0"
  }
}
```

### `index.js`
- Copy the entire `server/index.js` file

---

## 🔄 After Backend is Deployed

1. **Copy your backend URL** (e.g., `https://chatkaro-backend.glitch.me`)
2. **Update the client** to connect to your backend
3. **Redeploy client** to Netlify

---

## ⚡ Quick Test

Once deployed, visit: `https://YOUR-BACKEND-URL.glitch.me/health`

You should see: `{"status": "ok", "timestamp": "..."}`

---

## 🎯 Next Step

After deployment, I'll update your client to connect to the new backend!
