# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sanctum Gateway Track - Hackathon Project**

Production-grade transaction analytics platform for Solana developers demonstrating Sanctum Gateway API integration.

**Deadline**: October 30, 2025 (Target submission: October 29)
**Current Status**: Day 10 of 22 - **100% Production Deployed** ✅
**Project Type**: Full-stack TypeScript/React + Solana blockchain
**Last Updated**: November 1, 2025

### Key Achievements ✅

**Production Status**: 100% Deployed to Production VPS
- ✅ Gateway Integration - buildGatewayTransaction + sendTransaction working on mainnet
- ✅ Backend - 10 REST APIs, WebSocket, Transaction tracking, Analytics, Wallet Monitoring
- ✅ Frontend - Real-time dashboard, 40+ components, dark mode, responsive UI
- ✅ Analytics - 17 charts, cost analysis, success rate tracking, alerts
- ✅ Deployment - VPS with CI/CD auto-deploy, SSL, custom domain
- ✅ Testing - All features tested, 0 TODO/MOCK code

**Quantitative Results**:
- 🎯 **Gateway Value**: Smart routing provides Jito-level MEV protection at RPC-level costs
- 💰 **Cost Efficiency**: 90.91% savings vs always-using-Jito (auto-refunds)
- 📊 **513 Transactions** - Real production data (73.7% success rate)
- ⚡ **<100ms Response Time** average (backend APIs)
- 🚀 **0 Rate Limit Errors** - Helius RPC (100k req/day free tier)
- 🌐 **Live**: https://sanctum.rectorspace.com + https://api.sanctum.rectorspace.com
- ⚙️ **CI/CD**: GitHub Actions → 40s deployment
- 📦 **Local PostgreSQL**: 513 transactions migrated, 5 indexes

---

## Repository Structure

**Key Directories**:
- `src/backend/` - Node.js/Express API (gateway/, database/, api/, services/)
- `src/frontend/` - Next.js 15 React app (app/, components/, lib/)
- `docs/planning/` - PRD.md, EXECUTION-PLAN.md, TIMELINE.md
- `docs/technical/` - DATABASE-SCHEMA.md, GATEWAY-*.md, SECURITY-AUDIT.md
- `docs/testing/` - TESTING-RESULTS-FINAL.md, MANUAL-TESTING-GUIDE.md
- `docs/deployment/` - DEPLOYMENT-CHECKLIST.md, deployment guides

**See README.md for complete project structure and setup instructions.**

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript 5.9.3 (strict mode)
- **Framework**: Express 5.1.0
- **Database**: PostgreSQL 16 (Local VPS - migrated from Supabase)
- **Cache**: Redis 7.0.15 (Local VPS - migrated from Upstash)
- **Gateway**: Sanctum Gateway API
- **Solana**: @solana/web3.js 1.98.4 + Helius RPC (100k req/day free tier)
- **Real-time**: WebSocket (ws 8.18.3)

### Frontend
- **Framework**: Next.js 15.5.4 with App Router + Turbopack
- **Language**: TypeScript 5.x (strict mode)
- **React**: 19.1.0
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui (11 components)
- **Charts**: Recharts 3.2.1 (17 charts)
- **Data**: SWR 2.3.6 (caching, auto-refresh)

### Deployment
- **Platform**: Production VPS (Ubuntu 24.04, 8 CPU, 8GB RAM)
- **Frontend**: https://sanctum.rectorspace.com (Nginx → PM2 Next.js :3000)
- **Backend**: https://api.sanctum.rectorspace.com (Nginx → PM2 Express :3001)
- **CI/CD**: GitHub Actions auto-deploy on push to `main`/`submission`
- **Process Manager**: PM2 with systemd (auto-restart on reboot)
- **SSL**: Let's Encrypt (auto-renewal via Certbot)
- **DNS**: A records → 176.222.53.185

---

## Development Commands

### Backend
```bash
cd src/backend
npm run dev              # Development server (tsx watch)
npm run build            # Production build
npm run typecheck        # TypeScript strict checking
npm run db:test          # Test database connection
npm run db:migrate       # Run migrations
```

### Frontend
```bash
cd src/frontend
npm run dev              # Development server (Next.js + Turbopack)
npm run build            # Production build
npm run typecheck        # TypeScript checking
npm run lint             # ESLint
```

---

## Core Features

### Analytics Dashboard
- Real-time transaction feed (WebSocket), 4 key metrics, cost breakdown
- Savings calculator (90.91% vs Jito), success rate metrics
- Failure analysis (6 categories), response time analysis (P50/P95/P99)
- Historical trends (17 interactive charts), alert system, data export
- Dark mode support

### Wallet Monitoring
- Monitor any Solana wallet address with real-time tracking
- Client-side validation, 60s polling interval, WebSocket updates
- Error handling, Helius RPC integration, database persistence

### Backend API (10 Endpoints)
1. `/api/analytics/overview` - Overall metrics
2. `/api/analytics/transactions` - Transaction list (filtered, paginated)
3. `/api/analytics/costs` - Cost comparison & savings
4. `/api/analytics/success-rates` - Success rates by method
5. `/api/analytics/trends` - Time-series data
6. `/api/analytics/delivery-methods` - Method breakdown
7. `/api/analytics/errors` - Error categorization
8. `/api/analytics/alerts` - Real-time health alerts
9. `POST /api/monitor/wallet` - Start monitoring wallet
10. `GET /api/monitor/wallets` - List monitored wallets

### Production Quality
- TypeScript strict mode (0 errors), error boundaries, loading/empty states
- SQL injection protection (parameterized queries), XSS protection
- Database indexes (5), Redis caching, WebSocket exponential backoff
- Security audit (80% score - acceptable for demo)

---

## Gateway Integration (MANDATORY)

### Integration Points
```typescript
// src/backend/gateway/client.ts
import { Gateway } from '@sanctum/gateway-sdk';

const gateway = new Gateway({ apiKey: process.env.GATEWAY_API_KEY });

// 1. Build transaction via Gateway
const transaction = await gateway.buildGatewayTransaction(params);

// 2. Send transaction via Gateway
const result = await gateway.sendTransaction(transaction);

// 3. Track metadata for analytics
await trackTransaction({
  signature: result.signature,
  deliveryMethod: result.deliveryMethod,
  cost: result.cost,
  success: result.success
});
```

### Why Gateway is Essential (Corrected Value Proposition)

**Gateway is NOT about being cheaper than RPC** - RPC is already the cheapest option!

**Gateway's Real Value**:
1. **Smart Routing** 🧠
   - Automatically chooses RPC (cheap) or Jito (MEV protection) based on transaction needs
   - You don't have to decide - Gateway intelligently routes for you

2. **Dual-Submission with Auto-Refunds** 💰
   - Submits to BOTH Jito and RPC simultaneously
   - Keeps whichever succeeds first
   - **Automatically refunds the unused submission**
   - Result: Jito benefits (MEV protection, priority) at RPC costs when RPC wins
   - This is the "90.91% savings vs always-using-Jito"

3. **MEV Protection When Needed** 🛡️
   - Arbitrage bots can't front-run your important transactions
   - Priority execution during network congestion
   - Bundle transactions together

4. **Unified Developer Experience** 🚀
   - Single API instead of managing 3 different endpoints (RPC, Jito, Sanctum Sender)
   - Automatic failover (if Jito fails, RPC still goes through)
   - Unified metadata tracking (delivery method, cost, status)
   - No need to choose which method to use per transaction

**Accurate Messaging**:
- ❌ "Gateway is cheaper than RPC" (incorrect)
- ✅ "Gateway provides Jito-level MEV protection at RPC-level costs through smart dual-submission"

---

## Critical Files

### Must Read First
1. **README.md** - Comprehensive project overview
2. **docs/planning/EXECUTION-PLAN.md** - Progress tracker with daily logs
3. **docs/technical/GATEWAY-INTEGRATION-SUCCESS.md** - Mainnet success documentation
4. **docs/technical/EXTERNAL-DEPENDENCIES.md** - Cloud service dependencies
5. **docs/testing/TESTING-RESULTS-FINAL.md** - All bugs fixed documentation

### Technical Deep Dives
- **docs/technical/DATABASE-SCHEMA.md** - Database design
- **docs/technical/SECURITY-AUDIT.md** - Security assessment
- **docs/technical/PERFORMANCE-OPTIMIZATION.md** - Performance analysis
- **docs/technical/PRODUCTION-READINESS.md** - Deployment checklist

---

## Environment Variables

### Backend (.env)
```bash
# Gateway Configuration
GATEWAY_API_KEY=your_gateway_api_key
GATEWAY_RPC_URL=https://tpg.sanctum.so/v1/mainnet?apiKey=YOUR_KEY

# Solana Configuration
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY
SOLANA_NETWORK=mainnet-beta

# Database Configuration (Production: Local VPS)
DATABASE_URL=postgresql://sanctum_user:sanctum_local_2025@localhost:5432/gateway_insights
REDIS_URL=redis://localhost:6379

# Development alternative (Supabase/Upstash)
# DATABASE_URL=postgresql://postgres:***@db.supabase.co:5432/postgres
# REDIS_URL=rediss://default:***@upstash.io:6379

# Server Configuration
PORT=3001
NODE_ENV=development

# Wallet Monitor Configuration
POLL_INTERVAL_MS=60000          # Poll every 60 seconds
MAX_TRANSACTIONS_PER_POLL=5     # Fetch 5 transactions per poll
REQUEST_DELAY_MS=300            # 300ms delay between requests
```

**Important**: Get free Helius API key at https://dev.helius.xyz/ (100,000 requests/day)

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**See README.md for complete environment setup guide.**

---

## External Dependencies

### Production Stack (VPS)
1. ✅ **PostgreSQL 16** (Local VPS) - Migrated from Supabase (IPv6 issues)
2. ✅ **Redis 7.0.15** (Local VPS) - Migrated from Upstash (eliminate inactivity timeout)
3. ✅ **Sanctum Gateway API** (cloud-only, proprietary) - **REQUIRED** for hackathon
4. ✅ **Solana RPC** (Helius) - Required for blockchain access

### Development Alternative
- PostgreSQL: Supabase (cloud)
- Redis: Upstash (cloud)
- Gateway API: Sanctum (cloud) - always required
- Solana RPC: Helius (cloud) - always required

**Note**: Backend cannot run fully local - Gateway API and Solana network are always external. This is expected and required for a blockchain analytics app.

**See docs/technical/EXTERNAL-DEPENDENCIES.md for detailed dependency analysis.**

---

## Development Principles

### 1. Production Quality
- 100% working standard maintained
- All edge cases handled
- Error states, loading states, empty states
- Security measures in place
- Performance optimized

### 2. Gateway-First
- All transactions via Gateway (never direct RPC)
- Track all metadata (delivery method, cost, success)
- Document Gateway value clearly

### 3. Documentation
- Code changes → update relevant docs
- Maintain EXECUTION-PLAN.md daily
- Keep CLAUDE.md accurate

### 4. Testing
- Test before and after changes
- Verify fixes with Playwright
- Manual testing for critical paths

---

## Key Metrics to Highlight

For judges and submission:
- **90.91% cost savings** vs direct Jito submission
- **73.7% success rate** (378/513 confirmed transactions) - real production data
- **513 transactions** migrated and analyzed
- **<100ms response time** average (backend APIs)
- **40s CI/CD deployment** time (GitHub Actions)
- **17 interactive charts** for comprehensive analytics
- **40+ React components** production-ready
- **10 REST API endpoints** fully functional
- **0 TypeScript errors** (strict mode)
- **100% production deployed** - live on custom domain with SSL

---

## Document Metadata

**Last Updated**: November 1, 2025 - Day 10+ of 22
**Status**: ✅ Production Deployed (100%)
**Project Health**: 🟢 Excellent - fully functional production app

**Live Production URLs**:
- Frontend: https://sanctum.rectorspace.com
- Backend: https://api.sanctum.rectorspace.com
- Build Info: https://sanctum.rectorspace.com/api/build-info

**Recent Production Achievements**:
- ✅ CI/CD auto-deploy (GitHub Actions)
- ✅ Data migrated from Supabase → Local PostgreSQL (513 transactions)
- ✅ Redis migrated from Upstash → Local VPS (eliminate timeout risk)
- ✅ Redis caching working (6 cache hits confirmed)
- ✅ Auto-restart configured (PM2 + systemd)

**Alhamdulillah! App is 100% production ready. May Allah grant success in this project. Bismillah!**
