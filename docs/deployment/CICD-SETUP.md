# CI/CD Setup Guide

**Automatic deployment on `git push` to VPS** - Just like Vercel! 🚀

---

## Overview

Every time you push to `main` or `submission` branch, GitHub Actions will automatically:
1. ✅ SSH into your VPS
2. ✅ Pull latest code
3. ✅ Install dependencies
4. ✅ Build backend + frontend
5. ✅ Restart PM2 services
6. ✅ Verify deployment

**Total deployment time**: ~2-3 minutes

---

## Setup Instructions

### Step 1: Add SSH Private Key to GitHub Secrets (5 minutes)

1. **Copy the private key below**:

```
***SSH_PRIVATE_KEY_REDACTED***
***SSH_KEY_DATA_REDACTED***
***SSH_KEY_DATA_REDACTED***
***SSH_KEY_DATA_REDACTED***
***SSH_KEY_DATA_REDACTED***
***SSH_KEY_DATA_REDACTED***
***SSH_PRIVATE_KEY_END***
```

2. **Go to your GitHub repository**:
   - https://github.com/RECTOR-LABS/sanctum-gateway-track

3. **Navigate to Settings**:
   - Click **Settings** tab
   - Click **Secrets and variables** → **Actions**
   - Click **New repository secret**

4. **Add these 3 secrets**:

#### Secret 1: VPS_SSH_KEY
```
Name: VPS_SSH_KEY
Value: [Paste the entire private key from above, including BEGIN and END lines]
```

#### Secret 2: VPS_HOST
```
Name: VPS_HOST
Value: 176.222.53.185
```

#### Secret 3: VPS_USERNAME
```
Name: VPS_USERNAME
Value: sanctum
```

5. **Click "Add secret"** for each one

---

### Step 2: Commit and Push Workflow File (2 minutes)

The workflow file `.github/workflows/deploy.yml` has already been created!

**Commit it to your repository:**

```bash
cd /Users/rz/local-dev/sanctum-gateway-track

# Stage the new workflow file
git add .github/workflows/deploy.yml
git add CICD-SETUP.md

# Commit
git commit -m "Add CI/CD: Auto-deploy on push to VPS"

# Push to GitHub
git push origin main
```

**That's it!** 🎉 Your CI/CD is now active!

---

## How to Use

### Automatic Deployment

Every time you push to `main` or `submission` branch:

```bash
# Make your changes
git add .
git commit -m "Add new feature"
git push origin main

# GitHub Actions automatically deploys to VPS!
```

### Manual Deployment

You can also trigger deployment manually:

1. Go to: https://github.com/RECTOR-LABS/sanctum-gateway-track/actions
2. Click **Deploy to VPS** workflow
3. Click **Run workflow** button
4. Select branch → Click **Run workflow**

---

## Monitoring Deployments

### View Deployment Status

1. Go to: https://github.com/RECTOR-LABS/sanctum-gateway-track/actions
2. Click on the latest workflow run
3. Watch real-time logs

### Deployment Steps

You'll see these steps:
```
✅ Checkout code
✅ Deploy to VPS via SSH
   📥 Pulling latest changes from GitHub
   🔧 Building backend
   🎨 Building frontend
   ♻️  Restarting services
   ✅ Deployment complete!
✅ Deployment Status
```

### Verify Deployment

After successful deployment, check:
- 🌐 Frontend: https://sanctum.rectorspace.com
- 🔌 Backend: https://api.sanctum.rectorspace.com/health

---

## Deployment Workflow Explained

### What Happens on Push

```yaml
# .github/workflows/deploy.yml

on:
  push:
    branches: [ main, submission ]  # Trigger on these branches
  workflow_dispatch:                # Allow manual trigger

jobs:
  deploy:
    steps:
      1. SSH into VPS (sanctum@176.222.53.185)
      2. Navigate to ~/sanctum-gateway-track
      3. Git pull latest changes
      4. Build backend (npm ci + npm run build)
      5. Build frontend (npm ci + npm run build)
      6. Restart PM2 (pm2 restart sanctum-backend + sanctum-frontend)
      7. Save PM2 config (pm2 save)
      8. Verify services running (pm2 list)
```

### Build Time

- Backend build: ~10-15 seconds
- Frontend build: ~30-45 seconds
- **Total**: ~2-3 minutes

---

## Troubleshooting

### Deployment Failed

**Check GitHub Actions logs:**
1. Go to: https://github.com/RECTOR-LABS/sanctum-gateway-track/actions
2. Click the failed workflow
3. Expand the "Deploy to VPS via SSH" step
4. Read error messages

**Common issues:**

#### SSH Key Error
```
Error: Permission denied (publickey)
```
**Fix**: Verify `VPS_SSH_KEY` secret is correct (must include BEGIN/END lines)

#### Git Pull Failed
```
Error: Your local changes would be overwritten
```
**Fix**: SSH into VPS and run:
```bash
ssh sanctum
cd ~/sanctum-gateway-track
git reset --hard origin/main
```

#### Build Failed
```
Error: npm ERR! code ELIFECYCLE
```
**Fix**: Check if there are TypeScript errors in your code

#### PM2 Restart Failed
```
Error: [PM2] Process not found
```
**Fix**: SSH into VPS and manually start processes:
```bash
ssh sanctum
cd ~/sanctum-gateway-track/src/backend
pm2 start dist/backend/index.js --name sanctum-backend
cd ../frontend
pm2 start npm --name sanctum-frontend -- start
pm2 save
```

---

## Advanced Configuration

### Deploy to Staging

Create a `staging` branch and update workflow:

```yaml
on:
  push:
    branches:
      - main        # Production
      - staging     # Staging environment
```

### Add Notifications

Get notified on deployment success/failure:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Run Tests Before Deploy

Add test step before deployment:

```yaml
- name: Run Tests
  run: |
    cd src/backend
    npm test
    cd ../frontend
    npm test
```

---

## Security Notes

### SSH Key Security

- ✅ Private key is stored in GitHub Secrets (encrypted)
- ✅ Only used during workflow execution
- ✅ Never exposed in logs
- ✅ Separate key from your personal SSH key

### Best Practices

1. ✅ Never commit `.env` files
2. ✅ Store secrets in GitHub Secrets
3. ✅ Use `npm ci` instead of `npm install` (faster, deterministic)
4. ✅ Always test locally before pushing

---

## Comparison with Vercel

| Feature | Vercel | VPS with GitHub Actions |
|---------|--------|------------------------|
| Auto-deploy on push | ✅ | ✅ |
| Build on commit | ✅ | ✅ |
| Environment variables | ✅ | ✅ (GitHub Secrets) |
| Preview deployments | ✅ | ✅ (via branches) |
| Rollback | ✅ One-click | Manual (git revert + push) |
| Custom domain | ✅ | ✅ |
| SSL certificates | ✅ Auto | ✅ Auto (Certbot) |
| Cost | Free tier limits | $0 (own VPS) |
| Speed | Very fast | ~2-3 minutes |

---

## Summary

✅ **CI/CD is configured!**
- Push to `main` → Auto-deploy to production
- Push to `submission` → Auto-deploy (for hackathon)
- Manual trigger available anytime

**Next steps:**
1. Add GitHub Secrets (VPS_SSH_KEY, VPS_HOST, VPS_USERNAME)
2. Commit workflow file
3. Push to GitHub
4. Watch your first automated deployment! 🚀

**Bismillah, happy deploying!** 🎉
