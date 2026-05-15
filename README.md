<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌍 World26 - AI-Powered 3D Simulation

A static GitHub Pages product with secure Cloudflare Worker AI proxy integration.

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| **[🚀 Quick Start](QUICKSTART.md)** | Fast command reference for common tasks |
| **[📖 Deployment Guide](temp_nexus-backend/DEPLOYMENT.md)** | Worker deployment instructions |
| **[🔗 Integration Guide](temp_nexus-backend/INTEGRATION.md)** | Frontend integration examples |
| **[🏗️ Architecture](ARCHITECTURE.md)** | System design and data flow |
| **[📊 Workflow](DEPLOYMENT_WORKFLOW.md)** | Visual deployment steps |
| **[🔧 Troubleshooting](TROUBLESHOOTING.md)** | Common issues and solutions |
| **[✅ Setup Complete](SETUP_COMPLETE.md)** | Summary of completed setup |

---

## 🏃 Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Configure locally (optional):
# Production proxy
echo "VITE_PROXY_URL=https://nexus-backend.YOUR_SUBDOMAIN.workers.dev/v1/chat/completions" > .env.local

# Development direct key (optional)
echo "VITE_MISTRAL_API_KEY=your_key_here" > .env.local

# 3. Start development server
npm run dev
```

Open http://localhost:5173 🎉

## Deploy to GitHub Pages

### 🔒 Recommended: Use the Cloudflare Worker proxy

1. **Deploy the Worker:**
   ```bash
   cd temp_nexus-backend
   npm install
   npm run setup
   ```

2. **Copy your Worker URL** (e.g., `https://nexus-backend.yourusername.workers.dev`)

3. **Configure Frontend:**
   Update `.env.local`:
   ```bash
   VITE_PROXY_URL=https://nexus-backend.yourusername.workers.dev/v1/chat/completions
   ```

4. **Deploy to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare World26 for GitHub Pages launch"
   git push origin main
   ```

📚 **Worker Documentation:**
- [Deployment Guide](temp_nexus-backend/DEPLOYMENT.md)
- [Integration Guide](temp_nexus-backend/INTEGRATION.md)
- [Interactive Test](temp_nexus-backend/test.html)

---

### Optional: Direct Mistral API Key
- Use `VITE_MISTRAL_API_KEY` for local development only.
- ⚠️ **Warning:** never commit your API key to source control.

---

**After Setup:**
- Push to `main` to trigger GitHub Pages deployment.
- Your site will be served from the configured Pages URL.
