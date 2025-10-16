# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sanctum Gateway Track - Hackathon Project**

This workspace is set up to participate in the Colosseum Cypherpunk Hackathon - Sanctum Gateway Track ($10,000 USDC prize pool). The project aims to build **Gateway Insights**, a production-grade transaction analytics platform for Solana developers that demonstrates meaningful integration with Sanctum's Gateway API.

**Deadline**: October 30, 2025 (Target submission: October 29)
**Project Type**: Full-stack TypeScript/React application with Solana blockchain integration
**Current Status**: Planning phase complete, ready for implementation

## Repository Structure

```
sanctum-gateway-track/
├── README.md                    # Project overview and quick start
├── CLAUDE.md                    # AI assistant guidance (this file)
├── docs/                        # Project documentation
│   ├── PRD.md                   # Product Requirements Document (Epic → Story → Task)
│   ├── EXECUTION-PLAN.md        # Progress tracker with daily logs
│   ├── TIMELINE.md              # 22-day day-by-day timeline
│   ├── TRACK-REQUIREMENTS.md    # Complete requirements checklist
│   ├── hackathon-analysis.md    # Comprehensive strategy analysis (16 sections)
│   └── hackathon-original.md    # Original hackathon listing (reference)
├── resources/                   # Reference materials
│   ├── RESOURCES.md
│   ├── official-docs/          # Gateway documentation backups
│   ├── starter-kits/           # Starter code templates
│   └── references/             # Additional references
└── src/                         # Implementation code (TO BE CREATED)
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
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express or Fastify (API server)
- **Database**: PostgreSQL (transaction data) + Redis (real-time caching)
- **Gateway**: Sanctum Gateway SDK
- **Solana**: @solana/web3.js
- **Real-time**: WebSocket or Server-Sent Events

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (utility-first, rapid development)
- **Components**: Shadcn/ui (polished components)
- **Charts**: Recharts (data visualization)
- **State**: React Context or Zustand
- **API**: SWR or TanStack Query

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

### Initial Setup (When Implementation Starts)
```bash
# Backend setup
cd src/backend
npm init -y
npm install express typescript @types/node @types/express
npm install @solana/web3.js
npm install pg redis ws
npm install -D tsx nodemon

# Frontend setup
cd src/frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install @shadcn/ui recharts
npm install swr axios

# Install Shadcn/ui components as needed
npx shadcn-ui@latest add button card chart
```

### Development Workflow
```bash
# Run backend development server
cd src/backend
npm run dev

# Run frontend development server
cd src/frontend
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test
npm run test:e2e
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

Refer to `docs/TIMELINE.md` for detailed daily breakdown. Key milestones:

- **Days 1-7 (Week 1)**: Core Gateway integration + data layer
- **Days 8-14 (Week 2)**: Dashboard + visualizations
- **Days 15-21 (Week 3)**: Innovation features + documentation
- **Day 22**: Submission (target Day 21 for 1-day buffer)

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

### Backend (src/backend/.env)
```bash
# Gateway Configuration
GATEWAY_API_KEY=your_gateway_api_key
GATEWAY_API_URL=https://gateway.sanctum.so/api

# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gateway_insights
REDIS_URL=redis://localhost:6379

# API
PORT=3001
NODE_ENV=development
```

### Frontend (src/frontend/.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Critical Success Factors

### Must-Have for Submission
1. ✅ Gateway integration complete (`buildGatewayTransaction` + `sendTransaction`)
2. ✅ Real-time transaction tracking working
3. ✅ Cost analysis showing concrete savings percentages
4. ✅ Dashboard with minimum 5 key metrics
5. ✅ Production-ready code quality
6. ✅ Comprehensive documentation explaining Gateway value
7. ✅ Video demo (3-5 minutes)
8. ✅ Tweet with metrics tagging @sanctumso

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
2. **docs/PRD.md** - Product Requirements Document (Epic → Story → Task breakdown)
3. **docs/EXECUTION-PLAN.md** - Progress tracker with daily logs
4. **docs/hackathon-analysis.md** - Complete strategy (16 sections)
5. **docs/TRACK-REQUIREMENTS.md** - Requirements checklist
6. **docs/TIMELINE.md** - Day-by-day execution plan

### Gateway Documentation
- Official docs: https://gateway.sanctum.so/docs
- Gateway platform: https://gateway.sanctum.so/
- Hackathon listing: https://earn.superteam.fun/listing/sanctum-gateway-track

### Support Channels
- Telegram: @kunalbagaria (Sanctum contact)
- Sanctum Discord: For technical questions
- Superteam Earn: For submission questions

## Special Considerations

### Zero Implementation Currently
This repository contains **planning documentation only**. There is NO source code yet. When starting implementation:

1. Create `src/` directory structure
2. Initialize package.json files for backend and frontend
3. Set up Gateway SDK integration FIRST (Days 1-3 critical)
4. Join Sanctum Discord early for API access and support

### Hackathon Context
- This is a competitive submission with prizes
- Quality over quantity: better fewer features done excellently
- Documentation is MANDATORY, not optional
- Social proof (tweet) is REQUIRED
- Submit 1 day early (Oct 29) for safety buffer

### Time Pressure Management
- 22 days total, already on Day 1
- Follow docs/TIMELINE.md religiously
- If behind schedule, cut innovation features FIRST
- Core integration + basic dashboard + solid docs beats ambitious incomplete project

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
- Daily progress check-ins against docs/TIMELINE.md and docs/EXECUTION-PLAN.md
- Update EXECUTION-PLAN.md daily with completed tasks
- Be ready to simplify scope if necessary

---

**May Allah grant tawfeeq and success in this endeavor! Focus, execute with excellence, and demonstrate Gateway's transformative value. Bismillah!**
