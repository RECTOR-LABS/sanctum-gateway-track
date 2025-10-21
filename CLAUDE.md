# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sanctum Gateway Track - Hackathon Project**

This workspace is set up to participate in the Colosseum Cypherpunk Hackathon - Sanctum Gateway Track ($10,000 USDC prize pool). The project aims to build **Gateway Insights**, a production-grade transaction analytics platform for Solana developers that demonstrates meaningful integration with Sanctum's Gateway API.

**Deadline**: October 30, 2025 (Target submission: October 29)
**Project Type**: Full-stack TypeScript/React application with Solana blockchain integration
**Current Status**: Day 9 of 22 - Epic 1 Complete (100%), Story 2.1 Complete (100%), Gateway Integration ✅, Database Layer ✅

### Key Achievements
- 🎉 **Mainnet Transaction Success**: Gateway integration confirmed with signature `52g35379jXE...`
- ✅ **buildGatewayTransaction + sendTransaction** pattern working perfectly
- ✅ **Database Layer Complete**: PostgreSQL (Supabase) + Redis (Upstash) + migrations + DAL
- ✅ **Frontend Initialized**: Next.js 15, React 19, Tailwind v4, Shadcn/ui ready
- 📈 **1 Day Ahead of Schedule**: Epic 1 completed Day 3 (target was Day 4)

## Repository Structure

```
sanctum-gateway-track/
├── README.md                    # Project overview and quick start
├── CLAUDE.md                    # AI assistant guidance (this file)
├── devnet-wallet.json          ✅ Devnet testing wallet
├── mainnet-wallet.json         ✅ Mainnet wallet (REC1Vu7...)
├── docs/                        # Project documentation
│   ├── planning/               # Planning & strategy documents
│   │   ├── PRD.md              ✅ Product Requirements Document (Epic → Story → Task)
│   │   ├── EXECUTION-PLAN.md   ✅ Progress tracker with daily logs (updated Day 4)
│   │   ├── TIMELINE.md         ✅ 22-day day-by-day timeline
│   │   ├── TRACK-REQUIREMENTS.md ✅ Complete requirements checklist
│   │   ├── hackathon-analysis.md ✅ Comprehensive strategy analysis (16 sections)
│   │   └── hackathon-original.md ✅ Original hackathon listing (reference)
│   ├── technical/              # Technical implementation docs
│   │   ├── DATABASE-SCHEMA.md  ✅ Database design and schema
│   │   ├── GATEWAY-INTEGRATION-SUCCESS.md ✅ Mainnet success documentation
│   │   └── GATEWAY-INTEGRATION-FINDINGS.md ✅ Integration research
│   └── setup/                  # Setup & infrastructure guides
│       ├── QUICK-SETUP-CHECKLIST.md ✅ Setup checklist
│       ├── SUPABASE-UPSTASH-SETUP.md ✅ Database setup guide
│       ├── RAILWAY-SETUP.md    ✅ Deployment planning
│       └── NEXT-STEPS-RAILWAY.md ✅ Infrastructure next steps
├── resources/                   # Reference materials
│   ├── RESOURCES.md
│   ├── official-docs/          # Gateway documentation backups
│   ├── starter-kits/           # Starter code templates
│   └── references/             # Additional references
└── src/                         # Implementation code (IN PROGRESS)
    ├── backend/                 ✅ Node.js/TypeScript API server
    │   ├── gateway/            ✅ Gateway SDK integration
    │   │   ├── client.ts       ✅ Gateway API client (buildGatewayTransaction + sendTransaction)
    │   │   └── transaction.ts  ✅ Transaction builders
    │   ├── database/           ✅ PostgreSQL (Supabase) + Redis (Upstash)
    │   │   ├── config.ts       ✅ Database configuration
    │   │   ├── migrate.ts      ✅ Migration runner
    │   │   ├── test-connection.ts ✅ Health checks
    │   │   ├── types/          ✅ TypeScript types and interfaces
    │   │   │   └── index.ts
    │   │   ├── dal/            ✅ Data Access Layer
    │   │   │   ├── transaction-dal.ts ✅ Transaction CRUD operations
    │   │   │   ├── analytics-dal.ts ✅ Analytics queries
    │   │   │   └── index.ts
    │   │   └── migrations/
    │   │       └── 001_create_transactions_table.sql ✅
    │   ├── services/           ✅ Business logic
    │   │   └── transaction-service.ts ✅
    │   ├── index.ts            ✅ Main entry point
    │   ├── package.json        ✅ All dependencies installed
    │   └── test-*.ts           ✅ 15+ Gateway integration test files
    └── frontend/               ✅ Next.js 15 React application
        ├── app/                ✅ Next.js app directory
        │   ├── layout.tsx      ✅ Root layout
        │   └── page.tsx        ✅ Home page
        ├── components/         ✅ React components
        │   └── ui/             ✅ Shadcn/ui components
        │       ├── button.tsx  ✅
        │       ├── card.tsx    ✅
        │       └── table.tsx   ✅
        ├── lib/                ✅ Utilities
        │   └── utils.ts        ✅
        ├── next.config.ts      ✅ Next.js configuration
        └── package.json        ✅ Dependencies installed
```

## Recommended Project Architecture

The planned **Gateway Insights** application should follow this structure:

```
src/
├── backend/                     # Node.js/TypeScript API server
│   ├── gateway/                # Gateway SDK integration
│   │   ├── client.ts           # Gateway API client
│   │   ├── transaction.ts      # buildGatewayTransaction & sendTransaction
│   │   └── tracker.ts          # Transaction event tracking
│   ├── database/               # PostgreSQL/MongoDB
│   │   ├── models/            # Data models
│   │   └── migrations/        # Schema migrations
│   ├── api/                   # REST API endpoints
│   │   ├── analytics.ts       # Analytics endpoints
│   │   ├── transactions.ts    # Transaction endpoints
│   │   └── websocket.ts       # Real-time updates
│   └── services/              # Business logic
│       ├── metrics.ts         # Calculate success rates, costs
│       └── alerts.ts          # Alert system
├── frontend/                   # Next.js 14 React application
│   ├── app/                   # Next.js app directory
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── analytics/         # Analytics views
│   │   └── api/              # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── charts/           # Recharts visualizations
│   │   └── transactions/     # Transaction components
│   └── lib/                   # Utilities
│       ├── api-client.ts     # Backend API client
│       └── websocket.ts      # WebSocket client
└── shared/                     # Shared types and utilities
    ├── types/                 # TypeScript types
    └── constants/             # Shared constants
```

## Recommended Tech Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript 5.9.3 ✅ INSTALLED
- **Framework**: Express 5.1.0 (API server) ✅ INSTALLED
- **Database**: PostgreSQL 17.6 via Supabase (transaction data) ✅ CONFIGURED
- **Caching**: Redis via Upstash (real-time caching) ✅ CONFIGURED
- **Gateway**: Sanctum Gateway API (buildGatewayTransaction + sendTransaction) ✅ INTEGRATED
- **Solana**: @solana/web3.js 1.98.4 ✅ INSTALLED
- **Real-time**: WebSocket (ws 8.18.3) ✅ INSTALLED
- **Additional**: dotenv, cors, pg (PostgreSQL client), redis client ✅ ALL INSTALLED

### Frontend
- **Framework**: Next.js 15.5.4 (App Router) with Turbopack ✅ INSTALLED
- **Language**: TypeScript 5.x ✅ INSTALLED
- **React**: React 19.1.0 ✅ INSTALLED
- **Styling**: Tailwind CSS v4 (utility-first, rapid development) ✅ INSTALLED
- **Components**: Shadcn/ui (polished components) ✅ INSTALLED (button, card, table)
- **Charts**: Recharts 3.2.1 (data visualization) ✅ INSTALLED
- **State**: React Context or Zustand
- **API**: SWR 2.3.6 ✅ INSTALLED

### Development Tools
- **Package Manager**: npm (default) or bun (if performance critical)
- **Linting**: ESLint + Prettier
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Type Checking**: TypeScript strict mode

### Deployment
- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Railway or Render
- **Database**: Railway PostgreSQL or Supabase
- **CI/CD**: GitHub Actions

## Common Development Commands

### Initial Setup ✅ COMPLETED
```bash
# Backend setup ✅ DONE
cd src/backend
npm init -y                                    # ✅ DONE
npm install express typescript @types/node     # ✅ DONE
npm install @solana/web3.js                    # ✅ DONE
npm install pg redis ws dotenv cors            # ✅ DONE
npm install -D tsx nodemon                     # ✅ DONE

# Frontend setup ✅ DONE
cd src/frontend
npx create-next-app@latest . --typescript --tailwind --app  # ✅ DONE (Next.js 15)
npm install recharts swr                       # ✅ DONE

# Shadcn/ui components ✅ PARTIALLY DONE
npx shadcn@latest add button card table        # ✅ DONE
# npx shadcn@latest add chart                  # ⏳ TODO when needed
```

### Database Setup ✅ COMPLETED
```bash
# Test database connections
npm run db:test                                # ✅ WORKING

# Run migrations
npm run db:migrate                             # ✅ DONE (001_create_transactions_table)

# Check migration status
npm run db:migrate:status                      # Available
```

### Development Workflow
```bash
# Run backend development server (tsx watch)
cd src/backend
npm run dev                                    # ✅ AVAILABLE

# Run frontend development server (Next.js + Turbopack)
cd src/frontend
npm run dev                                    # ✅ AVAILABLE

# Type checking
cd src/backend
npm run type-check                             # ✅ AVAILABLE

# Testing (to be implemented in Epic 5)
npm run test                                   # ⏳ TODO
npm run test:e2e                               # ⏳ TODO

# Database operations
npm run db:test                                # ✅ AVAILABLE
npm run db:migrate                             # ✅ AVAILABLE
```

### Build & Deployment
```bash
# Build frontend
cd src/frontend
npm run build

# Build backend
cd src/backend
npm run build

# Start production
npm run start
```

## Core Integration Requirements (MANDATORY)

### Gateway Integration Points
The project MUST implement these Gateway API calls:

1. **`buildGatewayTransaction`** - Build transactions via Gateway
2. **`sendTransaction`** - Send transactions via Gateway

### Example Integration Pattern
```typescript
// src/backend/gateway/transaction.ts
import { Gateway } from '@sanctum/gateway-sdk';

const gateway = new Gateway({ apiKey: process.env.GATEWAY_API_KEY });

export async function submitTransaction(params: TransactionParams) {
  // 1. Build transaction via Gateway
  const transaction = await gateway.buildGatewayTransaction(params);

  // 2. Send transaction via Gateway
  const result = await gateway.sendTransaction(transaction);

  // 3. Track metadata for analytics
  await trackTransaction({
    signature: result.signature,
    deliveryMethod: result.deliveryMethod, // RPC or Jito
    cost: result.cost,
    timestamp: new Date(),
    success: result.success
  });

  return result;
}
```

## Key Development Principles

### 1. Gateway-First Development
- **ALWAYS** route transactions through Gateway, not direct RPC
- Track ALL transaction metadata (delivery method, cost, success rate)
- Document HOW Gateway enables each feature (for submission docs)

### 2. Production Quality Standards
- Handle all error states gracefully
- Implement loading states for async operations
- Add input validation on all endpoints
- Security: API authentication, rate limiting, input sanitization
- Performance: Database indexing, caching, lazy loading

### 3. Analytics-Driven Design
The core value proposition is analytics, so prioritize:
- Real-time transaction tracking
- Cost analysis (RPC vs Jito, savings calculations)
- Success rate metrics by delivery method
- Historical trend visualization
- Clear before/after Gateway comparisons

### 4. Documentation as You Build
CRITICAL for hackathon success:
- Document Gateway integration decisions in code comments
- Track quantitative results (cost savings %, success rate improvements)
- Capture screenshots/data for final documentation
- Update README.md as features are completed

## Implementation Timeline Awareness

**Current Progress**: Day 9 of 22 (October 17, 2025) - **13 days remaining**
**Status**: 🟢 1 day ahead of schedule

Refer to `docs/planning/TIMELINE.md` for detailed daily breakdown and `docs/planning/EXECUTION-PLAN.md` for daily progress logs.

### Completed Milestones:
- ✅ **Days 1-3**: Epic 1 - Environment Setup & Gateway Integration (100% complete)
  - Gateway successfully integrated with mainnet transaction confirmed
  - Signature: `52g35379jXEbZtqRSXqKCxEa948ebtwz37cvGgBvNUaLD3sfb2jEhqauiX3H86Rsfh6PkdCXsak4HjZAFAaNcjx3`
- ✅ **Day 4**: Story 2.1 - Database Design & Setup (100% complete)
  - PostgreSQL (Supabase) + Redis (Upstash) configured and tested
  - Migrations created and executed
  - Data Access Layer (DAL) with TypeScript types complete

### Upcoming Milestones:
- **Days 9-10** (Current): Story 2.2 - Transaction Event Tracking
- **Days 11-14**: Story 2.3 - Analytics API + Epic 3 - Frontend Dashboard
- **Days 15-21**: Epic 4-5 - Analytics, Innovation, Testing
- **Day 21**: Submission target (1-day buffer before Oct 30 deadline)

## Testing Strategy

### Critical Test Coverage
1. **Gateway Integration Tests**
   - Test `buildGatewayTransaction` with various transaction types
   - Test `sendTransaction` success/failure scenarios
   - Test delivery method routing (RPC vs Jito)
   - Mock Gateway API for unit tests

2. **Analytics Accuracy Tests**
   - Verify cost calculation accuracy
   - Validate success rate calculations
   - Test data aggregation logic

3. **End-to-End Tests**
   - Full transaction flow (submit → track → display)
   - Real-time updates via WebSocket
   - Dashboard visualization rendering

## Environment Variables

### Backend (src/backend/.env) ✅ CONFIGURED
```bash
# Gateway Configuration ✅ SET
GATEWAY_API_KEY=your_gateway_api_key          # ✅ SET (from dashboard)
GATEWAY_API_URL=https://gateway.sanctum.so/v1 # ✅ SET

# Solana Configuration ✅ SET
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # ✅ SET
SOLANA_NETWORK=mainnet-beta                    # ✅ SET

# Database ✅ SET
DATABASE_URL=postgresql://...@aws-0-us-east-1.pooler.supabase.com:6543/postgres  # ✅ SET (Supabase)
REDIS_URL=redis://default:...@us1-clever-shrew-12345.upstash.io:6379  # ✅ SET (Upstash)

# API
PORT=3001                                      # ✅ SET
NODE_ENV=development                           # ✅ SET
```

**Note**: Also have `.env.devnet` configured for devnet testing.

### Frontend (src/frontend/.env.local) ⏳ TODO
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001     # ⏳ TODO (Epic 3)
NEXT_PUBLIC_WS_URL=ws://localhost:3001         # ⏳ TODO (Epic 3)
```

## Critical Success Factors

### Must-Have for Submission (Progress: 2/8)
1. ✅ **Gateway integration complete** (`buildGatewayTransaction` + `sendTransaction`) - **DONE Day 3**
2. ⏳ Real-time transaction tracking working - **IN PROGRESS** (Story 2.2)
3. ⏳ Cost analysis showing concrete savings percentages - **TODO** (Epic 4)
4. ⏳ Dashboard with minimum 5 key metrics - **TODO** (Epic 3-4)
5. ✅ **Production-ready code quality** - **ON TRACK** (strict TypeScript, DAL pattern, error handling)
6. ⏳ Comprehensive documentation explaining Gateway value - **TODO** (Epic 6)
7. ⏳ Video demo (3-5 minutes) - **TODO** (Epic 6)
8. ⏳ Tweet with metrics tagging @sanctumso - **TODO** (Epic 6)

### Differentiation Strategy
- **Production Quality**: Build something actually usable, not just a demo
- **Quantifiable Value**: Show exact numbers (e.g., "35% cost reduction")
- **Innovation Layer**: Add ML predictions or advanced analytics
- **Exceptional Docs**: README + video + blog post + case study

## Gateway Value Proposition Documentation

The hackathon judges want to see clear demonstration of what would be "hard or impossible" without Gateway. Document these points:

### Key Value Props to Highlight
1. **Unified API**: "Without Gateway, we'd need separate integrations for RPC providers + Jito + custom observability stack"
2. **Cost Optimization**: "Gateway's dual-submission with refunds saved X% vs direct Jito submission"
3. **Observability**: "Real-time tracking across delivery methods impossible without Gateway's unified dashboard"
4. **Reliability**: "Round-robin routing with automatic failover eliminated single-point RPC failures"

### Metrics to Track
- Cost savings percentage (RPC vs Jito vs Gateway)
- Success rate improvements
- Average response time by delivery method
- Jito tip refund amounts
- Transaction failure patterns

## References and Resources

### Essential Reading (In Order)
1. **README.md** - Start here for project overview
2. **docs/planning/PRD.md** - Product Requirements Document (Epic → Story → Task breakdown)
3. **docs/planning/EXECUTION-PLAN.md** - Progress tracker with daily logs (updated to Day 4)
4. **docs/technical/GATEWAY-INTEGRATION-SUCCESS.md** ✅ **CRITICAL** - Mainnet success + working patterns
5. **docs/technical/DATABASE-SCHEMA.md** ✅ Complete database design
6. **docs/planning/hackathon-analysis.md** - Complete strategy (16 sections)
7. **docs/planning/TRACK-REQUIREMENTS.md** - Requirements checklist
8. **docs/planning/TIMELINE.md** - Day-by-day execution plan

### Implementation Documentation (NEW)
- **docs/technical/GATEWAY-INTEGRATION-FINDINGS.md** - Research and testing journey
- **docs/setup/SUPABASE-UPSTASH-SETUP.md** - Database configuration guide
- **docs/setup/RAILWAY-SETUP.md** - Deployment planning
- **docs/setup/NEXT-STEPS-RAILWAY.md** - Infrastructure next steps
- **docs/setup/QUICK-SETUP-CHECKLIST.md** - Setup checklist

### Gateway Documentation
- Official docs: https://gateway.sanctum.so/docs
- Gateway platform: https://gateway.sanctum.so/
- Hackathon listing: https://earn.superteam.fun/listing/sanctum-gateway-track

### Support Channels
- Telegram: @kunalbagaria (Sanctum contact)
- Sanctum Discord: For technical questions
- Superteam Earn: For submission questions

## Special Considerations

### Current Implementation Status (Day 9 of 22)
**Epic 1 & Story 2.1 Complete** - Active development in progress:

#### ✅ Completed:
1. Backend infrastructure fully set up
   - Express server, TypeScript strict mode
   - Gateway integration working (mainnet confirmed)
   - Database layer complete (PostgreSQL + Redis)
   - Data Access Layer with full CRUD operations
2. Frontend initialized
   - Next.js 15 with React 19 and Turbopack
   - Shadcn/ui components installed
   - Basic structure ready for dashboard development
3. Testing & Documentation
   - 15+ Gateway integration test files
   - Comprehensive documentation created
   - Database migrations executed

#### 🟡 In Progress (Story 2.2):
- Transaction Event Tracking system
- Real-time WebSocket integration
- Analytics API endpoints

#### ⏳ Remaining Work:
- Frontend dashboard (Epic 3)
- Advanced analytics & visualizations (Epic 4)
- Innovation features (Epic 5)
- Final documentation & submission (Epic 6)

### Hackathon Context
- This is a competitive submission with prizes
- Quality over quantity: better fewer features done excellently
- Documentation is MANDATORY, not optional
- Social proof (tweet) is REQUIRED
- Submit 1 day early (Oct 29) for safety buffer

### Time Pressure Management
- **13 days remaining** (Day 9 of 22, October 17 → October 30)
- **Status**: 🟢 1 day ahead of schedule (Epic 1 complete Day 3 vs Day 4 target)
- Follow docs/planning/TIMELINE.md and docs/planning/EXECUTION-PLAN.md religiously
- If behind schedule, cut innovation features FIRST (Epic 5 is P1, not P0)
- Core integration ✅ + database ✅ + dashboard + solid docs = minimum viable submission
- Maintain "100% working standard" - polish over quantity

## Workflow Philosophy

### Ship with Excellence
- Focus on 100% working standard
- Production-ready mindset from Day 1
- Handle all edge cases and error states
- No "just make it work" mentality
- Polished, complete features only

### Development Approach
- MVP-first: Core features Week 1, polish Weeks 2-3
- Test continuously, not at the end
- Document as you build
- Daily progress check-ins against docs/planning/TIMELINE.md and docs/planning/EXECUTION-PLAN.md
- Update docs/planning/EXECUTION-PLAN.md daily with completed tasks
- Be ready to simplify scope if necessary

---

## Document Metadata

**Last Updated**: October 17, 2025 - Day 9 of 22
**Next Review**: Daily updates via docs/planning/EXECUTION-PLAN.md
**Document Status**: ✅ Accurate and current with repository state
**Project Health**: 🟢 Excellent - 1 day ahead of schedule

---

**May Allah grant tawfeeq and success in this endeavor! Focus, execute with excellence, and demonstrate Gateway's transformative value. Bismillah!**

**Alhamdulillah for the progress so far! Epic 1 complete, Gateway integration successful, database layer ready. 13 days remaining - stay focused, maintain quality, and deliver excellence! 🚀**
