# Vercel Deployment Guide: Always Deploy Latest

This guide explains how to configure Vercel to always fetch and deploy the latest commit from your repository.

## Quick Fix: Manual Redeploy

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments** tab
4. Click the **"..."** (three dots) menu on the latest deployment
5. Click **"Redeploy"**
6. Make sure "Use existing Build Cache" is **unchecked** (to ensure fresh build)

## Configure Automatic Deployments

### 1. Check Git Integration Settings

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Git**
3. Verify the following:
   - **Production Branch**: Should be set to `main` (or your default branch)
   - **Git Repository**: Should show the correct repository
   - **Deploy Hooks**: Check if any hooks are configured

### 2. Ensure Automatic Deployments Are Enabled

1. In **Settings** → **Git**
2. Under **"Deploy Hooks"** section:
   - Make sure "Automatic deployments from Git" is **enabled**
   - This ensures every push to `main` triggers a new deployment

### 3. Check for Specific Commit SHA Configuration

**If Vercel is building a specific commit:**

1. Go to **Deployments** tab
2. Check if there's a deployment pinned or locked to a specific commit
3. If you see a lock icon 🔒, click it to unlock
4. Go to **Settings** → **Git** and check for any commit SHA restrictions

### 4. Verify Branch Settings

1. **Settings** → **Git** → **Production Branch**
2. Should be set to: `main` (or `master` if that's your default)
3. If it's set to a different branch, change it to `main`

### 5. Clear Build Cache (if needed)

If deployments seem stuck or using old code:

1. Go to **Deployments** tab
2. Create a new deployment:
   - Click **"Create Deployment"** button (top right)
   - Select branch: `main`
   - **Uncheck** "Use existing Build Cache"
   - Click **"Deploy"**

## Troubleshooting

### Issue: Vercel builds old commit repeatedly

**Solution:**
1. Verify your latest commit is pushed to GitHub:
   ```bash
   git log origin/main -1
   ```
2. Check Vercel deployment shows the correct commit SHA
3. If not, trigger a manual redeploy

### Issue: Automatic deployments not triggering

**Solution:**
1. Go to **Settings** → **Git**
2. Click **"Disconnect"** then **"Connect Git Repository"** again
3. Re-authenticate and reconnect
4. Push a new commit to test:
   ```bash
   git commit --allow-empty -m "Trigger Vercel deployment"
   git push origin main
   ```

### Issue: Build cache causing issues

**Solution:**
1. In **Settings** → **Build & Development Settings**
2. Check **"Build Command"** - should be `npm run build`
3. Check **"Output Directory"** - should be `.next`
4. For fresh builds, disable cache when redeploying

## Best Practices

1. **Always check deployment commit SHA** matches your latest push
2. **Use environment variables** for sensitive data (not hardcoded)
3. **Monitor build logs** to catch issues early
4. **Set up preview deployments** for PRs (automatic)

## Verify Latest Deployment

After pushing new code:

1. Check GitHub: Ensure commit is pushed
   ```bash
   git push origin main
   ```

2. Check Vercel: Go to **Deployments** tab
   - Latest deployment should show your new commit SHA
   - Status should be "Building" then "Ready"

3. If deployment doesn't appear:
   - Wait 30 seconds (GitHub webhook delay)
   - Manually trigger: **Create Deployment** → Select `main` branch

## Quick Commands

```bash
# Check latest commit on remote
git log origin/main -1

# Check if local is ahead
git status

# Push latest commits
git push origin main

# Force push (use with caution)
git push origin main --force-with-lease
```

## Important Notes

- **Never delete `.vercel` folder** - it contains deployment configuration
- **Production branch** should match your Git default branch
- **Build cache** can be useful but disable if experiencing stale builds
- **Webhooks** take a few seconds to trigger after git push

