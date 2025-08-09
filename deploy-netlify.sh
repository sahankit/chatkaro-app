#!/bin/bash

echo "🔥 Deploying ChatKaro to Netlify..."

# Install Netlify CLI if not present
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the client
echo "📦 Building React client..."
cd client
npm install
npm run build
cd ..

# Create netlify.toml for configuration
cat > netlify.toml << EOF
[build]
  publish = "client/build"
  command = "cd client && npm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/socket.io/*"
  to = "/.netlify/functions/socket"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
EOF

# Create serverless functions directory
mkdir -p netlify/functions

# Create a serverless function for the API
cat > netlify/functions/api.js << 'EOF'
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'netlify-functions'
  });
});

// Get rooms
app.get('/api/rooms', (req, res) => {
  const rooms = [
    { id: 'general', name: 'General Chat', description: 'General discussion', userCount: 0 },
    { id: 'tech', name: 'Tech Talk', description: 'Technology discussions', userCount: 0 },
    { id: 'gaming', name: 'Gaming', description: 'Gaming discussions', userCount: 0 },
    { id: 'music', name: 'Music', description: 'Music and entertainment', userCount: 0 },
    { id: 'sports', name: 'Sports', description: 'Sports discussions', userCount: 0 },
    { id: 'food', name: 'Food & Cooking', description: 'Food and cooking', userCount: 0 },
    { id: 'movies', name: 'Movies & TV', description: 'Movies and TV shows', userCount: 0 },
    { id: 'books', name: 'Books', description: 'Book discussions', userCount: 0 },
    { id: 'travel', name: 'Travel', description: 'Travel experiences', userCount: 0 },
    { id: 'fitness', name: 'Fitness', description: 'Health and fitness', userCount: 0 },
    { id: 'art', name: 'Art & Design', description: 'Art and design', userCount: 0 },
    { id: 'science', name: 'Science', description: 'Science discussions', userCount: 0 },
    { id: 'business', name: 'Business', description: 'Business and entrepreneurship', userCount: 0 },
    { id: 'education', name: 'Education', description: 'Learning and education', userCount: 0 },
    { id: 'random', name: 'Random', description: 'Random conversations', userCount: 0 },
    { id: 'help', name: 'Help & Support', description: 'Get help and support', userCount: 0 }
  ];
  res.json(rooms);
});

module.exports.handler = serverless(app);
EOF

# Create package.json for functions
cat > netlify/functions/package.json << EOF
{
  "name": "netlify-functions",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "serverless-http": "^3.2.0",
    "cors": "^2.8.5"
  }
}
EOF

# Install function dependencies
cd netlify/functions
npm install
cd ../..

echo "🚀 Deploying to Netlify..."

# Login if needed
if ! netlify status &>/dev/null; then
    echo "🔐 Please login to Netlify..."
    netlify login
fi

# Deploy
netlify deploy --prod

echo ""
echo "🎉 ============================================"
echo "✅ Netlify Deployment Complete!"
echo "🎉 ============================================"
echo ""
echo "🌍 Your ChatKaro app is live!"
echo "📊 Netlify Dashboard: https://app.netlify.com"
echo ""
echo "⚠️  Note: Socket.IO real-time features are limited on Netlify"
echo "💡 For full real-time chat, consider Vercel or Railway"
echo ""
echo "🔗 To set up continuous deployment:"
echo "   1. Push your code to GitHub"
echo "   2. Connect the repo in Netlify dashboard"
echo "   3. Auto-deploy on every push!"
echo ""
