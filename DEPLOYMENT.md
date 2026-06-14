# Cyra Console - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel:** https://vercel.com/
2. **Sign in/Sign up** with your GitHub account
3. **Click "Add New Project"**
4. **Import your GitHub repository:**
   - Select `yashita7/Cyra` from the list
   - Click "Import"

### Step 3: Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset:** Vite
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Click **"Deploy"** - Vercel will build and deploy!

---

## 🔐 Set Environment Variables (CRITICAL)

Your AWS credentials need to be set in Vercel (NOT committed to git):

### In Vercel Dashboard:

1. Go to your project → **"Settings" → "Environment Variables"**
2. Add these variables:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
NOVA_MODEL_ID=amazon.nova-pro-v1:0
NODE_ENV=production
```

3. **Apply to:** Production, Preview, and Development
4. Click **"Save"**
5. **Redeploy** your project for changes to take effect

---

## 🎯 How the Deployment Works

### Frontend (Vite)
- Built as static files in `dist/`
- Served directly by Vercel's CDN
- All routes (`/`, `/inbox`, `/grade`, etc.) work via client-side routing

### Backend (Express API)
- `api/index.js` wraps your Express server
- Deployed as Vercel Serverless Functions
- `/api/grade` and `/api/decide` endpoints available
- Cache files (`src/data/cached/*.json`) included in deployment

### API Routes
- **Health Check:** `https://your-app.vercel.app/api/health`
- **Grading:** `POST https://your-app.vercel.app/api/grade`
- **Decision:** `POST https://your-app.vercel.app/api/decide`

---

## 🧪 Fallback Mode (No AWS Credentials)

If you **don't** add AWS credentials, the app still works!

- API endpoints return cached responses from `src/data/cached/`
- ModelBadge shows "fallback" state
- Perfect for testing deployment before adding credentials

---

## 📋 Pre-Deployment Checklist

- ✅ Code pushed to GitHub (`main` branch)
- ✅ `.env` is in `.gitignore` (credentials not committed)
- ✅ `vercel.json` configuration added
- ✅ `api/index.js` serverless wrapper created
- ✅ Build succeeds locally: `npm run vercel-build`

---

## 🔄 Deploy via CLI (Alternative Method)

If you prefer using the CLI:

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Link to existing project? Yes
# - Which project? Cyra (or create new)
# - Production deployment? Yes
```

---

## 🎬 Pre-Recording Setup (IMPORTANT!)

Before recording your demo video:

### 1. Add AWS Credentials to Vercel
Follow the "Set Environment Variables" section above

### 2. Pre-Warm the Live Calls
Visit your deployed app and run the flow once:
- Go to `/inbox`
- Click the hero return
- Run grading (wait for result)
- Run decision (wait for result)

This populates the cache with fresh results from Bedrock.

### 3. Verify Cache
Check that:
- Grading completes in <5s
- Decision completes in <8s
- ModelBadge shows "live" state (not fallback)

### 4. Subsequent Loads = Instant
Once cached, all future calls return instantly (~100ms) from the cache.

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run vercel-build

# Check for TypeScript errors
npm run typecheck
```

### API Returns Fallback
- **Check:** Environment variables are set in Vercel dashboard
- **Check:** Variables applied to Production environment
- **Action:** Redeploy after adding env vars

### API 404 Errors
- **Check:** `vercel.json` routes configuration
- **Check:** `/api/health` endpoint responds
- **Action:** Redeploy with latest code

### Serverless Function Timeout
- Default: 10s (set in `vercel.json`)
- Nova calls should complete in 4-8s
- If timing out, increase `maxDuration` in `vercel.json`

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard
- **Analytics:** See visitor traffic
- **Functions:** Monitor API call performance
- **Logs:** Debug serverless function errors

### Check Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

Should return:
```json
{
  "ok": true,
  "bedrock": "configured",
  "region": "us-east-1",
  "model": "amazon.nova-pro-v1:0"
}
```

---

## 💰 Cost Considerations

### Vercel (FREE for hackathons)
- Hobby plan: FREE
- 100GB bandwidth/month
- Unlimited serverless function invocations
- Perfect for demos

### AWS Bedrock
- Pay-per-token (pennies per call)
- Pre-warming = 2 calls total
- Demo = maybe 5-10 calls
- **Total cost:** < $0.50

### Set Billing Alarm
In AWS Console:
1. Go to CloudWatch → Alarms
2. Create alarm for billing
3. Set threshold: $5
4. Add your email

---

## 🎥 Demo Video URL

After deployment, your live demo will be at:
```
https://cyra-[random].vercel.app
```

Use this URL in:
- Your demo video
- Hackathon submission
- GitHub README
- Presentation slides

---

## 🔒 Security Best Practices

✅ **DO:**
- Store AWS credentials in Vercel env vars
- Use `.env.example` with dummy values in repo
- Keep `.env` in `.gitignore`
- Use IAM user with minimal permissions (Bedrock only)

❌ **DON'T:**
- Commit `.env` file
- Hardcode credentials in code
- Share AWS keys publicly
- Use root account credentials

---

## 📝 Post-Deployment Steps

1. ✅ Test full 8-screen flow on production URL
2. ✅ Verify live AI calls work (grading + decision)
3. ✅ Check reduced motion support
4. ✅ Test on mobile/tablet viewports
5. ✅ Pre-warm cache before recording
6. ✅ Update README with live demo link
7. ✅ Share URL with your team

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **AWS Bedrock Docs:** https://docs.aws.amazon.com/bedrock/

---

**Good luck with your deployment and demo! 🚀**
