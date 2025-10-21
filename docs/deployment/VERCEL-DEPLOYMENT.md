# Vercel Frontend Deployment Guide

**Gateway Insights - Sanctum Gateway Track**

Complete step-by-step guide for deploying the Gateway Insights frontend to Vercel.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Vercel Project Setup](#vercel-project-setup)
4. [Environment Variables](#environment-variables)
5. [Build Configuration](#build-configuration)
6. [Deployment](#deployment)
7. [Domain Configuration](#domain-configuration)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring & Analytics](#monitoring--analytics)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ [Vercel account](https://vercel.com/) (GitHub sign-in recommended)
- ✅ GitHub repository with frontend code
- ✅ Railway backend deployed and running (see `RAILWAY-DEPLOYMENT.md`)

### Required Information
Before starting, gather:
- ✅ **Backend API URL** from Railway deployment
  - Example: `https://your-app-production.up.railway.app`
- ✅ **Backend WebSocket URL** from Railway deployment
  - Example: `wss://your-app-production.up.railway.app`
- ✅ GitHub repository URL

### Required Tools (Optional)
```bash
# Vercel CLI (optional but recommended)
npm install -g vercel

# Verify installation
vercel --version
```

---

## Pre-Deployment Checklist

### Step 1: Verify Production Build Locally

Before deploying, ensure the production build works locally:

```bash
cd src/frontend

# Install dependencies
npm install

# Run production build
npm run build

# Check for build errors
# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Creating an optimized production build
```

**Expected Build Output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.1 kB         95 kB
└ ○ /_not-found                          875 B          90 kB

○  (Static)  prerendered as static content

✓ Built in 5.1s
```

**Fix Build Errors** before proceeding to deployment.

### Step 2: Test Production Build Locally

```bash
# Start production server locally
npm run start

# Visit http://localhost:3000
# Verify:
# ✅ Dashboard loads without errors
# ✅ Components render correctly
# ✅ No console errors
# ✅ Dark mode toggle works
```

### Step 3: Type Check

```bash
# Run TypeScript type checking
npm run type-check

# Or (if not in package.json):
npx tsc --noEmit

# Expected: No errors
```

---

## Vercel Project Setup

### Option A: Deploy via Vercel Dashboard (Recommended for First Deployment)

#### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Authorize Vercel to access your GitHub account
5. Select **`sanctum-gateway-track`** repository
6. Click **"Import"**

#### Step 2: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**:
- Click **"Edit"**
- Set to: `src/frontend`
- Click **"Continue"**

**Build & Development Settings**:
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)
- **Install Command**: `npm install` (auto-filled)
- **Development Command**: `npm run dev` (auto-filled)

**Node.js Version**:
- Vercel auto-detects from `package.json` engines field
- Recommended: 20.x

Click **"Deploy"** (will fail without env vars - expected).

---

### Option B: Deploy via Vercel CLI (Alternative)

For advanced users who prefer CLI:

```bash
cd src/frontend

# Login to Vercel
vercel login

# Link project (first time only)
vercel link

# Follow prompts:
# ? Set up and deploy? Yes
# ? Which scope? [Your account]
# ? Link to existing project? No
# ? What's your project's name? gateway-insights
# ? In which directory is your code located? ./

# Deploy to production
vercel --prod
```

---

## Environment Variables

### Step 1: Add Environment Variables in Vercel Dashboard

After project import (or via CLI):

1. Go to **Project Settings** → **Environment Variables**
2. Add the following variables:

#### Required Variables

```bash
# Backend API URL (from Railway deployment)
NEXT_PUBLIC_API_URL=https://your-app-production.up.railway.app

# Backend WebSocket URL (from Railway deployment)
NEXT_PUBLIC_WS_URL=wss://your-app-production.up.railway.app
```

**IMPORTANT**:
- Replace `your-app-production.up.railway.app` with your actual Railway URL
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Without `NEXT_PUBLIC_` prefix, variables are server-side only

#### Optional Variables

```bash
# Analytics (if using Vercel Analytics)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto

# Feature flags (if needed)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_WEBSOCKET=true

# Environment indicator
NEXT_PUBLIC_ENV=production
```

### Step 2: Set Environment Scope

For each variable, select which environments it applies to:
- ✅ **Production** (required)
- ✅ **Preview** (recommended for testing)
- ⬜ **Development** (optional - uses local `.env.local`)

### Step 3: Verify via CLI (Optional)

```bash
# List all environment variables
vercel env ls

# Pull environment variables to local .env file
vercel env pull .env.vercel
```

---

## Build Configuration

### Verify next.config.ts

Ensure `src/frontend/next.config.ts` is optimized for production:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression

  // Environment variables validation (optional)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || '',
  },

  // Image optimization (if using next/image)
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features (Next.js 15)
  experimental: {
    // Enable if using Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
```

### Verify package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### TypeScript Configuration

Verify `tsconfig.json` is optimized:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Deployment

### Step 1: Trigger Deployment

Vercel automatically deploys on:
- ✅ **Git push to `main` branch** (Production deployment)
- ✅ **Git push to any branch** (Preview deployment)
- ✅ **Pull Request opened** (Preview deployment with unique URL)
- ✅ **Manual "Deploy" button** in dashboard

**Manual Deployment**:
1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Click **"Redeploy"** button (top right)

### Step 2: Monitor Deployment

#### Via Dashboard

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Watch real-time build logs

**Deployment Stages**:
```
1. Building... (2-4 minutes)
   ✓ Cloning repository
   ✓ Installing dependencies (npm install)
   ✓ Linting and type checking
   ✓ Building application (npm run build)
   ✓ Optimizing pages
   ✓ Generating static pages

2. Deploying... (30 seconds)
   ✓ Uploading build artifacts
   ✓ Deploying to Edge Network
   ✓ Running health checks

3. Ready (green checkmark)
   ✓ Deployment successful
   ✓ Live on production domain
```

#### Via CLI

```bash
# Watch deployment in real-time
vercel --prod --logs

# Or check deployment status
vercel inspect [deployment-url]
```

### Step 3: Get Production URL

Once deployed:

1. Vercel auto-generates domains:
   - **Production**: `your-project.vercel.app`
   - **Preview**: `your-project-git-branch.vercel.app`

2. Copy the production URL

**Expected Result**: Your frontend is now live at `https://your-project.vercel.app`

---

## Domain Configuration

### Add Custom Domain (Optional)

#### Step 1: Add Domain in Vercel

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `yourdomain.com` or `app.yourdomain.com`
4. Click **"Add"**

#### Step 2: Configure DNS

Vercel provides DNS instructions. Add one of these records:

**Option A: Root Domain (yourdomain.com)**
```
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   3600
```

**Option B: Subdomain (app.yourdomain.com)**
```
Type:  CNAME
Name:  app
Value: cname.vercel-dns.com
TTL:   3600
```

#### Step 3: SSL Certificate

Vercel automatically provisions SSL certificates:
- ✅ Takes 5-10 minutes after DNS propagation
- ✅ Auto-renews every 90 days
- ✅ Supports wildcard domains (*.yourdomain.com)
- ✅ Forces HTTPS redirect

**Verification**:
```bash
curl -I https://yourdomain.com

# Expected:
HTTP/2 200
x-vercel-id: ...
```

#### Step 4: Set Primary Domain

1. In **Domains** settings
2. Click **"..."** next to your custom domain
3. Select **"Set as Primary Domain"**
4. Vercel redirects `*.vercel.app` → `yourdomain.com`

---

## Performance Optimization

### Enable Vercel Analytics

1. Go to **Project Settings** → **Analytics**
2. Click **"Enable Analytics"**
3. Add to `src/frontend/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

4. Redeploy

**Metrics Tracked**:
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices & browsers

### Enable Vercel Speed Insights

1. Install package:
```bash
npm install @vercel/speed-insights
```

2. Add to `src/frontend/app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

3. Commit and push
4. View insights in Vercel dashboard

### Image Optimization

Use Next.js `<Image>` component for automatic optimization:

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Gateway Insights"
  width={200}
  height={50}
  priority // For above-the-fold images
/>
```

**Benefits**:
- Auto WebP/AVIF conversion
- Lazy loading
- Responsive images
- CDN caching

### Enable Edge Functions (Optional)

For API routes that need ultra-low latency:

```typescript
// src/frontend/app/api/example/route.ts
export const runtime = 'edge'; // Enable Edge Runtime

export async function GET(request: Request) {
  // This runs on Vercel's Edge Network (70+ locations worldwide)
  return Response.json({ message: 'Hello from the edge!' });
}
```

### Caching Strategy

Configure caching headers for static assets:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
};
```

---

## Monitoring & Analytics

### Vercel Dashboard Metrics

1. Go to **Project** → **Analytics**
2. View:
   - **Real User Monitoring** (RUM): Actual user experience
   - **Web Vitals**: LCP, FID, CLS, FCP, TTFB
   - **Audience**: Geographic distribution
   - **Top Pages**: Most visited pages

### Set Performance Budgets

1. Go to **Project Settings** → **Speed Insights**
2. Set performance thresholds:
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **FID** (First Input Delay): < 100ms
   - **CLS** (Cumulative Layout Shift): < 0.1

3. Vercel alerts if budgets are exceeded

### Custom Monitoring (Optional)

Integrate with external services:

```bash
# Add Sentry for error tracking
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs

# Add Sentry DSN to env vars
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## Lighthouse Audit

### Run Lighthouse Locally

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit on production URL
lighthouse https://your-project.vercel.app \
  --view \
  --output html \
  --output-path ./lighthouse-report.html

# Open report
open lighthouse-report.html
```

**Target Scores**:
- ✅ **Performance**: 90+
- ✅ **Accessibility**: 95+
- ✅ **Best Practices**: 95+
- ✅ **SEO**: 90+

### Common Lighthouse Issues & Fixes

#### Issue 1: Low Performance Score

**Problem**: Large bundle sizes

**Solution**:
```bash
# Analyze bundle
npm run build -- --analyze

# Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

#### Issue 2: Accessibility Issues

**Problem**: Missing alt text, low contrast

**Solution**:
```typescript
// Always add alt text to images
<img src="chart.png" alt="Cost analysis chart showing 90% savings" />

// Ensure sufficient color contrast (4.5:1 minimum)
// Use tools like https://contrast-ratio.com/
```

#### Issue 3: SEO Issues

**Problem**: Missing meta tags

**Solution**:
```typescript
// Add metadata to layout.tsx or page.tsx
export const metadata: Metadata = {
  title: 'Gateway Insights | Solana Transaction Analytics',
  description: 'Real-time transaction analytics and cost optimization for Solana developers powered by Sanctum Gateway',
  keywords: ['Solana', 'Gateway', 'Analytics', 'Transaction', 'Blockchain'],
  openGraph: {
    title: 'Gateway Insights',
    description: '90.91% cost savings on Solana transactions',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gateway Insights',
    description: '90.91% cost savings on Solana transactions',
    images: ['/og-image.png'],
  },
};
```

---

## Troubleshooting

### Build Failed: TypeScript Errors

**Error**: `Type error: Property 'X' does not exist on type 'Y'`

**Solution**:
```bash
# Run type check locally
npm run type-check

# Fix TypeScript errors
# Then commit and redeploy
```

---

### Build Failed: Environment Variables Missing

**Error**: `Error: NEXT_PUBLIC_API_URL is not defined`

**Solution**:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Ensure `NEXT_PUBLIC_API_URL` is set for **Production** environment
3. Redeploy

---

### Runtime Error: CORS Issues

**Error**: `Access to fetch at 'https://backend.railway.app/api/...' from origin 'https://your-app.vercel.app' has been blocked by CORS policy`

**Solution**:

1. Update Railway backend CORS configuration:
```bash
# In Railway dashboard → Environment Variables
FRONTEND_URL=https://your-app.vercel.app
```

2. Or in backend code:
```typescript
// src/backend/index.ts
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'https://your-app-*.vercel.app', // Preview deployments
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''
  ].filter(Boolean),
  credentials: true
}));
```

3. Redeploy backend

---

### 404 Error on Page Refresh

**Error**: Page works on navigation but returns 404 on refresh

**Cause**: Missing or incorrect Vercel configuration

**Solution**:

Create `vercel.json` in `src/frontend/`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Note**: This should not be needed for Next.js App Router, but include if issues persist.

---

### WebSocket Connection Failed

**Error**: `WebSocket connection to 'wss://...' failed: Error in connection establishment`

**Problem**: CORS or WebSocket URL incorrect

**Solution**:

1. Verify WebSocket URL:
```typescript
// Should use wss:// (not ws://)
const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
```

2. Check Railway backend supports WebSocket (it does by default)

3. Verify firewall/browser extensions aren't blocking WebSocket

---

### High Memory Usage / Build Timeout

**Error**: `Build exceeded maximum duration of 600 seconds`

**Solution**:

1. **Optimize dependencies**:
```bash
# Remove unused dependencies
npm prune

# Use smaller alternatives
# Example: date-fns instead of moment.js
```

2. **Reduce build output**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Disable source maps in production (reduces build time)
  productionBrowserSourceMaps: false,
};
```

3. **Upgrade Vercel plan** if necessary (Pro plan has longer build timeouts)

---

### Slow Initial Page Load

**Problem**: First visit takes too long to load

**Solution**:

1. **Enable Static Generation**:
```typescript
// For pages that don't need real-time data
export const dynamic = 'force-static';
```

2. **Optimize fonts**:
```typescript
// Use next/font for automatic font optimization
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

3. **Lazy load components**:
```typescript
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/AnalyticsChart'), {
  ssr: false, // Disable server-side rendering for client-only components
});
```

---

## Preview Deployments

### Automatic Preview URLs

Every branch/PR gets a unique preview URL:
- Format: `https://your-project-git-[branch-name]-[team].vercel.app`
- Perfect for testing before merging to production

### Testing Preview Deployments

```bash
# Create feature branch
git checkout -b feature/new-analytics

# Make changes
# Commit and push
git push origin feature/new-analytics

# Vercel automatically deploys preview
# Check Vercel dashboard for preview URL
```

### Share Preview with Team

1. Go to **Deployments** tab
2. Click on preview deployment
3. Click **"Visit"** to open preview
4. Share URL for testing/review

---

## Production Checklist

Before marking deployment as complete:

- ✅ Production build completes without errors
- ✅ All environment variables are set correctly
- ✅ Custom domain configured (if applicable)
- ✅ SSL certificate is active (green padlock in browser)
- ✅ Analytics and Speed Insights enabled
- ✅ CORS configured correctly with backend
- ✅ WebSocket connection working
- ✅ All pages load without 404 errors
- ✅ Lighthouse scores meet targets (90+ performance)
- ✅ Mobile responsiveness verified
- ✅ Dark mode toggle works
- ✅ Error boundaries handle errors gracefully
- ✅ SEO meta tags are present

---

## Cost Optimization

### Vercel Pricing (as of 2025)

- **Hobby (Free)**: $0/month
  - 100GB bandwidth
  - 100GB-hours serverless execution
  - 6,000 build minutes
  - Perfect for hackathons and demos

- **Pro**: $20/month
  - 1TB bandwidth
  - 1000GB-hours serverless execution
  - Unlimited build minutes
  - Advanced analytics

### Staying Within Free Tier

1. **Optimize images** (use WebP/AVIF)
2. **Enable caching** (reduce serverless invocations)
3. **Static generation** where possible (no serverless needed)
4. **Limit preview deployments** (delete old previews)

---

## Next Steps

After successful Vercel deployment:

1. ✅ **Note your production URL**: `https://your-app.vercel.app`
2. ✅ **Update Railway backend CORS** with Vercel URL
3. ⏳ **Run post-deployment tests** (see `POST-DEPLOYMENT-CHECKLIST.md`)
4. ⏳ **Take screenshots** for documentation and video
5. ⏳ **Run Lighthouse audit** and optimize
6. ⏳ **Record demo video** using production app
7. ⏳ **Prepare submission** with live URLs

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Discord**: https://vercel.com/discord
- **Vercel Status**: https://vercel-status.com/
- **Project Issues**: https://github.com/yourusername/sanctum-gateway-track/issues

---

**Deployment Status**: ⏳ Ready to Deploy

**Estimated Time**: 20-30 minutes (first deployment)

**Last Updated**: October 21, 2025

---

**May this deployment be smooth and successful! Alhamdulillah for reaching this milestone!**
