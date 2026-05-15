# 🚀 Deployment Workflow

## Visual Step-by-Step Guide

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: PREPARE WORKER                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
                    ┌──────────────────┐
                    │  cd temp_mistral │
                    │   apicaller      │
                    │  npm install     │
                    └────────┬─────────┘
                             │
┌────────────────────────────┴─────────────────────────────────┐
│                    STEP 2: CONFIGURE SECRETS                 │
└──────────────────────────────────────────────────────────────┘
                              │
                              ↓
              ┌───────────────────────────────┐
              │  npm run secret:set           │
              │  (Paste Mistral API Key)      │
              └───────────────┬───────────────┘
                              │
┌─────────────────────────────┴────────────────────────────────┐
│                  STEP 3: SETUP DATABASE                      │
└──────────────────────────────────────────────────────────────┘
                              │
                              ↓
                  ┌─────────────────────┐
                  │ D1 Database Exists? │
                  └──────────┬──────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                   YES               NO
                    │                 │
                    │        ┌────────┴────────┐
                    │        │ wrangler d1     │
                    │        │ create world26  │
                    │        └────────┬────────┘
                    │                 │
                    │                 │ Update wrangler.jsonc
                    │                 │ with database_id
                    └────────┬────────┘
                             │
                             ↓
                  ┌──────────────────────┐
                  │  npm run             │
                  │  migrate:remote      │
                  └──────────┬───────────┘
                             │
┌────────────────────────────┴──────────────────────────────────┐
│                   STEP 4: DEPLOY WORKER                       │
└───────────────────────────────────────────────────────────────┘
                             │
                             ↓
                   ┌──────────────────┐
                   │  npm run deploy  │
                   └─────────┬────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │  ✅ Worker Deployed!         │
              │  URL: https://mistral...     │
              │       .workers.dev           │
              └──────────────┬───────────────┘
                             │
                             │ Copy URL
                             ↓
┌────────────────────────────┴──────────────────────────────────┐
│                 STEP 5: TEST WORKER                           │
└───────────────────────────────────────────────────────────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │  Open test.html in browser   │
              │  OR                          │
              │  curl https://...workers.dev │
              └──────────────┬───────────────┘
                             │
                        ┌────┴────┐
                        │         │
                   ✅ Works    ❌ Failed
                        │         │
                        │    ┌────┴────────┐
                        │    │ Check logs: │
                        │    │ npm run logs│
                        │    └─────────────┘
                        │
┌───────────────────────┴───────────────────────────────────────┐
│              STEP 6: CONFIGURE FRONTEND                       │
└───────────────────────────────────────────────────────────────┘
                             │
                             ↓
                   ┌──────────────────┐
                   │  cd ../          │
                   │  (project root)  │
                   └─────────┬────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │  Edit .env.local:            │
              │  VITE_PROXY_URL=             │
              │  https://...workers.dev/     │
              │  v1/chat/completions         │
              └──────────────┬───────────────┘
                             │
┌────────────────────────────┴──────────────────────────────────┐
│                STEP 7: TEST LOCALLY                           │
└───────────────────────────────────────────────────────────────┘
                             │
                             ↓
                   ┌──────────────────┐
                   │  npm run dev     │
                   └─────────┬────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │  Open http://localhost:5173  │
              │  Test simulation             │
              └──────────────┬───────────────┘
                             │
                        ┌────┴────┐
                        │         │
                   ✅ Works    ❌ Failed
                        │         │
                        │    ┌────┴────────────┐
                        │    │ Check:          │
                        │    │ - .env.local    │
                        │    │ - Worker logs   │
                        │    │ - Browser console│
                        │    └─────────────────┘
                        │
┌───────────────────────┴───────────────────────────────────────┐
│            STEP 8: DEPLOY TO GITHUB PAGES                     │
└───────────────────────────────────────────────────────────────┘
                             │
                             ↓
                   ┌──────────────────┐
                   │  git add .       │
                   │  git commit -m   │
                   │  "Add proxy"     │
                   │  git push        │
                   └─────────┬────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │  GitHub Actions Triggered    │
              │  - Build with Vite           │
              │  - Deploy to gh-pages        │
              └──────────────┬───────────────┘
                             │
┌────────────────────────────┴──────────────────────────────────┐
│                STEP 9: VERIFY PRODUCTION                      │
└───────────────────────────────────────────────────────────────┘
                             │
                             ↓
              ┌──────────────────────────────┐
              │  Visit:                      │
              │  https://username.github.io  │
              │  /world26/                   │
              └──────────────┬───────────────┘
                             │
                        ┌────┴────┐
                        │         │
                   ✅ Live!   ❌ 404 Error
                        │         │
                        │    ┌────┴────────────┐
                        │    │ Enable Pages:   │
                        │    │ Settings →      │
                        │    │ Pages →         │
                        │    │ Source: gh-pages│
                        │    └─────────────────┘
                        │
┌───────────────────────┴───────────────────────────────────────┐
│                   🎉 SUCCESS!                                 │
│                                                               │
│  Your AI-powered simulation is now live with:                │
│  ✅ Secure API key management                                │
│  ✅ Global edge network                                      │
│  ✅ Persistent state storage                                 │
│  ✅ No CORS issues                                           │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 Time Estimates

| Step | Estimated Time |
|------|---------------|
| 1. Prepare Worker | 2 minutes |
| 2. Configure Secrets | 1 minute |
| 3. Setup Database | 2 minutes |
| 4. Deploy Worker | 2 minutes |
| 5. Test Worker | 3 minutes |
| 6. Configure Frontend | 1 minute |
| 7. Test Locally | 5 minutes |
| 8. Deploy to GitHub | 3 minutes |
| 9. Verify Production | 2 minutes |
| **TOTAL** | **~20 minutes** |

*First time only. Updates take ~2 minutes.*

---

## 🔄 Update Workflow (After Initial Setup)

```
┌────────────────────┐
│  Make code changes │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐     ┌─────────────────────┐
│  Worker changes?   │────▶│  cd temp_mistral... │
│                    │ YES │  npm run deploy     │
└─────────┬──────────┘     └─────────────────────┘
          │ NO
          ↓
┌────────────────────┐
│  Frontend changes? │
│                    │
└─────────┬──────────┘
          │ YES
          ↓
┌────────────────────┐
│  git add .         │
│  git commit        │
│  git push          │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│  ✅ Auto-deployed! │
└────────────────────┘
```

---

## 🛠️ Troubleshooting Decision Tree

```
                   ┌─────────────────┐
                   │   Having Issues? │
                   └────────┬─────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
    ┌─────────▼──────────┐    ┌──────────▼─────────┐
    │  Worker Issues?    │    │  Frontend Issues?   │
    └─────────┬──────────┘    └──────────┬──────────┘
              │                           │
    ┌─────────┴─────────┐       ┌────────┴─────────┐
    │                   │       │                  │
    ▼                   ▼       ▼                  ▼
"Missing Key"    "CORS Error"  "Failed to   ".env.local
    │                   │       fetch"       missing?"
    │                   │       │                  │
    ▼                   ▼       ▼                  ▼
npm run         curl -I...  Check Worker  Add VITE_
secret:set      (check      logs         PROXY_URL
                headers)
```

---

## 📱 Mobile-Friendly Checklist

```
□ Worker deployed ✓
□ Secret configured ✓
□ Database migrated ✓
□ Worker tested ✓
□ Frontend configured ✓
□ Tested locally ✓
□ Pushed to GitHub ✓
□ Pages enabled ✓
□ Production verified ✓
```

---

## 🎯 Critical Success Factors

1. ✅ **Correct Worker URL**: Must end with `/v1/chat/completions`
2. ✅ **API Key Set**: Use `npm run secret:set`, not .env file
3. ✅ **Database Migrated**: Run migrations before deployment
4. ✅ **CORS Enabled**: Worker automatically adds headers
5. ✅ **GitHub Pages Enabled**: Settings → Pages → gh-pages branch

---

## 🚀 One-Command Setup (Automated)

```bash
cd temp_nexus-backend && npm run setup
```

This runs the `deploy.sh` script which handles:
- Dependency installation
- Secret configuration
- Database setup
- Worker deployment

---

## 📞 Quick Help

| Problem | Solution Command |
|---------|-----------------|
| Worker not responding | `cd temp_nexus-backend && npm run logs` |
| API key missing | `cd temp_nexus-backend && npm run secret:set` |
| Database error | `cd temp_nexus-backend && npm run migrate:remote` |
| Frontend can't connect | Check `.env.local` has `VITE_PROXY_URL` |
| Changes not live | `git push origin main` |

---

**🎉 You're ready to deploy! Follow the visual guide above.**
