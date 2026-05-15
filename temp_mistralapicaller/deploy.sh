#!/bin/bash

# 🚀 World26 Cloudflare Worker Deployment Script
# This script automates the deployment of your API proxy worker

set -e  # Exit on error

echo "🌍 World26 Cloudflare Worker Deployment"
echo "========================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Navigate to worker directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔑 Checking for API key secret..."
if wrangler secret list 2>&1 | grep -q "MISTRAL_API_KEY"; then
    echo "✅ MISTRAL_API_KEY already set"
else
    echo "⚠️  MISTRAL_API_KEY not found"
    echo "Please enter your Mistral API key (it will be stored securely in Cloudflare):"
    wrangler secret put MISTRAL_API_KEY
fi

echo ""
echo "🗄️  Setting up D1 database..."
# Check if database exists by trying to query it
if wrangler d1 execute world26-memory --command="SELECT 1" &> /dev/null; then
    echo "✅ Database 'world26-memory' already exists"
else
    echo "Creating D1 database..."
    wrangler d1 create world26-memory
    echo ""
    echo "⚠️  IMPORTANT: Update wrangler.jsonc with the database_id from above!"
    echo "Press Enter when you've updated the database_id..."
    read
fi

echo ""
echo "🔄 Running database migrations..."
wrangler d1 migrations apply world26-memory --remote

echo ""
echo "🚀 Deploying worker to Cloudflare..."
wrangler deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Your Worker URL:"
echo "   https://nexus-backend.YOUR_SUBDOMAIN.workers.dev"
echo ""
echo "📋 Next Steps:"
echo "   1. Copy your Worker URL from above"
echo "   2. Update .env.local with: VITE_PROXY_URL=<your-worker-url>/v1/chat/completions"
echo "   3. Test your worker: open test.html in a browser"
echo "   4. Deploy your frontend to GitHub Pages"
echo ""
echo "📚 Documentation:"
echo "   - Full guide: DEPLOYMENT.md"
echo "   - Integration: INTEGRATION.md"
echo "   - Test interface: test.html"
echo ""
echo "🎉 Happy building!"
