# 🚀 Cloudflare Worker Deployment Guide

## Overview
This Cloudflare Worker serves as a secure API proxy for your World26 application, keeping your Mistral AI API key hidden from client-side code while enabling seamless GitHub Pages integration.

## 🎯 Features
- ✅ Proxies Mistral AI API requests
- ✅ Handles simulation state persistence (D1 Database)
- ✅ Full CORS support for GitHub Pages
- ✅ Health check endpoint
- ✅ Secure API key management

---

## 📋 Prerequisites
- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

---

## 🛠️ Step 1: Install Dependencies

```bash
cd temp_nexus-backend
npm install
```

---

## 🔑 Step 2: Configure Secrets

### Set your Mistral API Key
```bash
npx wrangler secret put MISTRAL_API_KEY
```
When prompted, paste your Mistral API key.

### Verify Secrets
```bash
npx wrangler secret list
```

---

## 🗄️ Step 3: Set Up D1 Database

### Create the database
```bash
npx wrangler d1 create world26-memory
```

### Update wrangler.jsonc
Copy the `database_id` from the output and update `wrangler.jsonc`:
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "world26-memory",
      "database_id": "YOUR_DATABASE_ID_HERE"
    }
  ]
}
```

### Run migrations
```bash
npx wrangler d1 migrations apply world26-memory --remote
```

---

## 🚀 Step 4: Deploy to Cloudflare

```bash
npx wrangler deploy
```

After deployment, you'll see your Worker URL:
```
https://nexus-backend.YOUR_SUBDOMAIN.workers.dev
```

**Save this URL!** You'll need it for Step 5.

---

## 🧪 Step 5: Test Your Worker

### Test health check
```bash
curl https://nexus-backend.YOUR_SUBDOMAIN.workers.dev/
```

Expected response:
```json
{
  "status": "online",
  "service": "World26 API Proxy",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /",
    "chat": "POST /v1/chat/completions",
    "state": {
      "get": "GET /state",
      "post": "POST /state"
    }
  },
  "cors": "enabled",
  "message": "Ready to serve GitHub Pages"
}
```

### Test Mistral API proxy
```bash
curl -X POST https://nexus-backend.YOUR_SUBDOMAIN.workers.dev/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-large-latest",
    "messages": [
      {"role": "user", "content": "Say hello!"}
    ]
  }'
```

---

## 🌐 Step 6: Configure Your Frontend

### Option A: Environment Variable (Recommended)

Create or update `.env.local` in the root of your project:
```bash
VITE_PROXY_URL=https://nexus-backend.YOUR_SUBDOMAIN.workers.dev/v1/chat/completions
```

### Option B: Direct Code Update

Update [services/aiLogic.ts](../services/aiLogic.ts):
```typescript
const proxyUrl = 'https://nexus-backend.YOUR_SUBDOMAIN.workers.dev/v1/chat/completions';
```

---

## 📦 Step 7: Deploy to GitHub Pages

### Build your frontend
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Configure Cloudflare Worker proxy"
git push origin main
```

Enable GitHub Pages in your repository settings:
1. Go to **Settings** > **Pages**
2. Set Source to **main** branch
3. Set folder to **/** (root) or **/dist** (if using dist)
4. Click **Save**

Your site will be available at:
```
https://YOUR_USERNAME.github.io/world26/
```

---

## 🔍 API Endpoints

### `GET /`
Health check and service information
```bash
curl https://YOUR_WORKER.workers.dev/
```

### `POST /v1/chat/completions`
Proxy to Mistral AI. Supports two formats:

**Standard Mistral Format:**
```json
{
  "model": "mistral-large-latest",
  "messages": [
    {"role": "system", "content": "You are..."},
    {"role": "user", "content": "What is..."}
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Simplified Format:**
```json
{
  "systemInstruction": "You are...",
  "prompt": "What is...",
  "model": "mistral-large-latest"
}
```

### `GET /state`
Retrieve saved simulation state
```bash
curl https://YOUR_WORKER.workers.dev/state
```

### `POST /state`
Save simulation state
```bash
curl -X POST https://YOUR_WORKER.workers.dev/state \
  -H "Content-Type: application/json" \
  -d '{"state": {"objects": [], "timestamp": 123456}}'
```

---

## 🔧 Development

### Run locally
```bash
npx wrangler dev
```

Access at: `http://localhost:8787`

### View logs
```bash
npx wrangler tail
```

### Update worker
```bash
npx wrangler deploy
```

---

## 🔒 Security Notes

✅ **API Key Protection**: Your Mistral API key is stored securely in Cloudflare and never exposed to clients  
✅ **CORS Enabled**: Allows requests from any origin (GitHub Pages compatible)  
✅ **Rate Limiting**: Consider adding Cloudflare rate limiting rules for production  
✅ **Environment Isolation**: Secrets are environment-specific (production vs development)

---

## 🐛 Troubleshooting

### "Missing API Key" error
```bash
npx wrangler secret put MISTRAL_API_KEY
```

### CORS errors in browser
Verify your Worker has CORS middleware enabled. Check the response headers:
```bash
curl -I https://YOUR_WORKER.workers.dev/
```
Should include: `Access-Control-Allow-Origin: *`

### Database errors
Re-run migrations:
```bash
npx wrangler d1 migrations apply world26-memory --remote
```

### Worker not updating
Clear deployment cache:
```bash
npx wrangler deploy --compatibility-date=2025-01-17
```

---

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [Mistral AI API Docs](https://docs.mistral.ai/)

---

## 🎉 Success!

Once deployed, your GitHub Pages site can securely call your Cloudflare Worker, which proxies requests to Mistral AI while keeping your API key safe.

**Your Architecture:**
```
GitHub Pages (Public)
    ↓ fetch()
Cloudflare Worker (Proxy)
    ↓ with API Key
Mistral AI API
```

No API keys in browser. No CORS issues. No security vulnerabilities. 🔒
