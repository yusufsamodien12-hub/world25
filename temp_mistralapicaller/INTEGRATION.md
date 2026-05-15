# 🔗 Frontend Integration Guide

## Quick Integration Steps

### 1️⃣ Set Environment Variable

Create/update `.env.local` in your project root:

```bash
# Production: Use your deployed Worker URL
VITE_PROXY_URL=https://nexus-backend.yusufsamodin67.workers.dev/v1/chat/completions

# Development: Optional - use direct API or local worker
# VITE_MISTRAL_API_KEY=your_dev_key_here
```

### 2️⃣ Frontend Code Example

Your existing code in `services/aiLogic.ts` already supports the proxy! It automatically uses `VITE_PROXY_URL` when available.

**Current Implementation:**
```typescript
const proxyUrl = (import.meta as any)?.env?.VITE_PROXY_URL;

// Uses proxy if available, otherwise direct API
const endpoint = proxyUrl || 'https://api.mistral.ai/v1/chat/completions';
```

### 3️⃣ Request Format

The Worker supports **both** formats:

**Standard Format (Current):**
```typescript
await fetch(proxyUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'mistral-large-latest',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  })
});
```

**Simplified Format (Optional):**
```typescript
await fetch(proxyUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    systemInstruction: 'You are...',
    prompt: 'What is...',
    model: 'mistral-large-latest'
  })
});
```

### 4️⃣ State Persistence

Save/load simulation state using the Worker's D1 database:

**Save State:**
```typescript
await fetch('https://YOUR_WORKER.workers.dev/state', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    state: {
      objects: worldObjects,
      timestamp: Date.now(),
      version: '1.0.0'
    }
  })
});
```

**Load State:**
```typescript
const response = await fetch('https://YOUR_WORKER.workers.dev/state');
const { state } = await response.json();
// state will be null if no state exists
```

---

## 🧪 Testing

### In Browser (Development)
```bash
npm run dev
```
Visit `http://localhost:5173` and open DevTools Console

### Direct Worker Test
```bash
curl https://nexus-backend.yusufsamodin67.workers.dev/
```

### Interactive Test Page
Open `temp_mistralapicaller/test.html` in a browser

---

## 🚀 Deployment Checklist

- [ ] Worker deployed to Cloudflare
- [ ] `MISTRAL_API_KEY` secret set in Worker
- [ ] Worker URL copied
- [ ] `.env.local` updated with `VITE_PROXY_URL`
- [ ] Frontend tested locally
- [ ] Changes committed to Git
- [ ] Pushed to GitHub (triggers GitHub Pages deployment)

---

## 📊 Architecture Flow

```
┌──────────────────────┐
│   User's Browser     │
│   (GitHub Pages)     │
└──────────┬───────────┘
           │
           │ 1. React App calls fetch()
           ↓
┌──────────────────────┐
│  services/aiLogic.ts │
│  Uses VITE_PROXY_URL │
└──────────┬───────────┘
           │
           │ 2. POST /v1/chat/completions
           ↓
┌──────────────────────┐
│ Cloudflare Worker    │
│ temp_mistralapicaller│
│ + MISTRAL_API_KEY    │
│ + D1 Database        │
└──────────┬───────────┘
           │
           │ 3. Authenticated request
           ↓
┌──────────────────────┐
│   Mistral AI API     │
│ api.mistral.ai       │
└──────────────────────┘
```

---

## 🔒 Security Benefits

✅ **API Key Never Exposed**: Only Worker has access  
✅ **CORS Pre-Configured**: No browser security errors  
✅ **DDoS Protection**: Cloudflare edge network  
✅ **Rate Limiting**: Can be added via Cloudflare dashboard  

---

## 🆘 Common Issues

### Issue: "Failed to fetch" error
**Solution**: Check Worker URL in `.env.local` and verify Worker is deployed:
```bash
curl https://YOUR_WORKER.workers.dev/
```

### Issue: "Missing API Key" in response
**Solution**: Set the secret in Cloudflare:
```bash
npx wrangler secret put MISTRAL_API_KEY
```

### Issue: CORS error in browser
**Solution**: Verify Worker has CORS enabled (it should by default). Check response headers:
```bash
curl -I https://YOUR_WORKER.workers.dev/
```

### Issue: Worker returns 500 error
**Solution**: Check Worker logs:
```bash
cd temp_mistralapicaller
npx wrangler tail
```

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_PROXY_URL` | Recommended | Worker proxy endpoint | `https://...workers.dev/v1/chat/completions` |
| `VITE_MISTRAL_API_KEY` | Optional | For local dev without Worker | `your_mistral_key` |

---

## 💡 Pro Tips

1. **Use Proxy in Production**: Set `VITE_PROXY_URL` to hide API key
2. **Local Development**: You can still use `VITE_MISTRAL_API_KEY` for faster dev iteration
3. **State Persistence**: Use Worker's `/state` endpoints for saving simulation across sessions
4. **Monitor Usage**: Check Cloudflare dashboard for request analytics
5. **Custom Domain**: Add custom domain in Cloudflare for cleaner URLs

---

## 🎯 Next Steps

1. Deploy your Worker: `cd temp_mistralapicaller && npx wrangler deploy`
2. Copy Worker URL
3. Update `.env.local` with Worker URL
4. Test locally: `npm run dev`
5. Push to GitHub: `git push origin main`
6. Visit GitHub Pages site

**Your app is now production-ready with secure API access! 🎉**
