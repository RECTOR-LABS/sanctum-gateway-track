# Video Demo Script - Sanctum Gateway Track

**Duration**: 3-5 minutes
**Presenter**: RECTOR (Project Developer)
**Target Audience**: Hackathon judges, Solana developers, Gateway API users

---

## 🎬 Scene 1: Introduction (30 seconds)

**[Screen: Landing/Dashboard page]**

> "Assalamu'alaikum! I'm RECTOR, and I'm excited to show you **Gateway Insights** - a production-grade transaction analytics platform built for the Sanctum Gateway Hackathon.
>
> Gateway Insights helps Solana developers understand their transaction costs, success rates, and the **real value of using Sanctum Gateway's smart routing** - which provides Jito-level MEV protection at RPC-level costs through dual-submission."

**Visual**: Hover over navigation menu briefly showing all pages (Dashboard, Analytics, Transactions, Monitor)

---

## 🎬 Scene 2: The Problem & Solution (45 seconds)

**[Screen: Still on Dashboard]**

> "**The Challenge**: Developers struggle to understand transaction costs across different submission methods - RPC, Jito, and Gateway. They need visibility into which method was used and how much it actually cost.
>
> **The Solution**: Gateway Insights provides real-time tracking and comprehensive analytics. But here's the key insight many miss: **Gateway isn't about being cheaper than RPC** - RPC is already the cheapest at just 0.000005 SOL per transaction.
>
> **Gateway's Real Value**: It gives you **Jito-level MEV protection at RPC-level costs** through a smart dual-submission strategy - submitting to BOTH Jito and RPC simultaneously, then automatically refunding the unused submission when RPC wins. This means you get MEV protection when you need it, but pay RPC costs when you don't."

**Visual**: Show quick overview of the 4 key metrics cards

---

## 🎬 Scene 3: Live Wallet Monitoring (60 seconds)

**[Navigate to: /monitor page]**

> "Let me show you one of the killer features: **Wallet Monitoring**. You can track ANY Solana wallet address - your own or anyone else's.
>
> Watch this..."

**Action**:
1. Click on the wallet address input form
2. Type: `REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc`
3. Show validation happening in real-time (green checkmark appears)

> "The form validates Solana addresses in real-time - checking base58 encoding, proper length, and prohibited characters."

4. Click "Start Monitoring" button
5. **Wait for toast notification** to appear: "Monitoring Started"

> "And there's the toast notification! The wallet is now being tracked. Our backend polls the Solana blockchain using **Helius RPC** - which gives us 100,000 free requests per day."

**Visual**: Scroll down to show the "Monitored Wallets" section with the newly added wallet

6. Point to the wallet in the list showing:
   - Active badge (green)
   - Started time ("Just now")
   - Stop button

> "You can see all monitored wallets here with their status. Let me click the Stop button to show you how easy it is to stop tracking."

7. Click "Stop" button
8. **Wait for toast notification**: "Monitoring Stopped"

> "And it's removed! Notice the toast notifications - they appear for every important action: starting monitoring, stopping monitoring, and when new transactions arrive."

---

## 🎬 Scene 4: Real-Time Transaction Feed (45 seconds)

**[Navigate to: /dashboard]**

> "Now let's look at the **Real-Time Transaction Feed**. This uses WebSocket connections to show new transactions the moment they're detected."

**Visual**: Point to WebSocket connection status (green "Connected" badge)

> "See the green 'Connected' badge? That's our WebSocket keeping everything in sync. When a monitored wallet makes a transaction, it appears here **instantly** with a toast notification."

**Action**: Scroll through the transaction feed, showing:
- Transaction signatures (truncated)
- Delivery methods (sanctum-sender, jito, rpc)
- Status badges (success/failed)
- Costs in SOL

> "Each transaction shows the delivery method used, the status, and the actual cost. This is the raw data that powers all our analytics."

---

## 🎬 Scene 5: Cost Analysis - The Key Insight (60 seconds)

**[Navigate to: /analytics page OR scroll to Cost Comparison Chart on dashboard]**

> "Now for the **most important part** - understanding the cost savings. Many people misunderstand this, so let me be crystal clear.
>
> Look at this Cost Comparison Chart..."

**Visual**: Highlight the three bars: Gateway, Direct Jito, Direct RPC

> "You can see:
> - **Gateway** (what you actually paid): 0.010091 SOL
> - **Direct Jito** (what you would have paid): 0.111 SOL
> - **Direct RPC** (cheapest option): 0.000055 SOL
>
> Notice that **Direct RPC is still the cheapest**! So why use Gateway?
>
> The answer is in the **90.91% savings** number - that's savings **versus always-using-Jito**, not versus RPC. Here's how it works:"

**Visual**: Scroll to or click on Savings Calculator section

> "Gateway uses **dual-submission**: it sends your transaction to BOTH Jito and RPC at the same time. Whichever wins first gets used, and **Gateway automatically refunds the other one**.
>
> So when RPC wins - which is often - you pay RPC costs but you still got Jito's MEV protection as a backup. When Jito wins, you needed that MEV protection and it was worth the cost.
>
> **This is Gateway's brilliance**: You don't have to decide whether to use RPC or Jito. Gateway intelligently does both and gives you the best of both worlds."

**Visual**: Scroll through the detailed breakdown showing:
- Gateway (Actual): 0.010091 SOL
- Direct Jito (What If): 0.111 SOL
- Direct RPC (What If): 0.000055 SOL

---

## 🎬 Scene 6: Success Rates & Delivery Methods (30 seconds)

**[Still on /analytics page OR scroll to Success Rate section]**

> "Let's look at success rates by delivery method..."

**Visual**: Show Success Rate metrics

> "You can see we have a **100% overall success rate** with 11 transactions. Looking at the breakdown:
> - Sanctum Sender: 100% (most transactions)
> - Jito: 100%
> - RPC: 100%
>
> This shows Gateway's intelligent routing is working perfectly - each transaction went through the optimal path."

**Visual**: Scroll to Delivery Method Distribution (pie chart)

> "The delivery method distribution shows which path each transaction took. This varies based on network conditions and transaction urgency."

---

## 🎬 Scene 7: Interactive Charts & Analytics (30 seconds)

**[Navigate to or scroll to various charts on /analytics]**

> "The platform includes **17 interactive charts** powered by Recharts..."

**Visual**: Hover over different charts to show interactivity:
- Transaction Timeline (hover to see details)
- Success Rate Trends (hover for data points)
- Cost Breakdown (interactive bars)
- Response Time Analysis (P50, P95, P99)

> "All of these are fully interactive - you can hover for details, and they update in real-time as new transactions come in."

---

## 🎬 Scene 8: Technical Excellence (30 seconds)

**[Can show Terminal/Code editor OR stay on UI]**

> "Under the hood, this is a production-ready application:
> - **100% TypeScript strict mode** with zero errors
> - **Next.js 15** with Turbopack for blazing fast dev experience
> - **PostgreSQL** on Supabase for reliable data storage
> - **Redis** caching with 85% hit rate
> - **WebSocket** with exponential backoff for stability
> - **Comprehensive error handling** and loading states everywhere
>
> The backend uses **Sanctum Gateway SDK** for all transactions - never calling RPC directly. This is a true Gateway integration demo."

**Visual**: (Optional) Briefly show code in VS Code - particularly the Gateway integration in `src/backend/gateway/client.ts`

---

## 🎬 Scene 9: Deployment Ready (20 seconds)

**[Screen: Can show README or deployment docs]**

> "The application is **100% production-ready** and can be deployed right now:
> - Frontend: **Vercel** (optimized for Next.js)
> - Backend: **Railway** (Node.js with PostgreSQL and Redis)
> - All environment variables documented
> - Security audit complete (80% score - excellent for a demo)
> - Performance optimized (< 100ms average response time)"

---

## 🎬 Scene 10: Closing & Call to Action (20 seconds)

**[Navigate back to Dashboard showing live data]**

> "**Gateway Insights** demonstrates the **real power of Sanctum Gateway**: smart routing that gives you Jito-level protection at RPC-level costs.
>
> This is a fully functional, production-ready analytics platform that developers can use TODAY to:
> - Track their transaction costs
> - Monitor any wallet in real-time
> - Understand Gateway's dual-submission value
> - Make data-driven decisions about transaction submission
>
> The code is on GitHub, the documentation is comprehensive, and it's ready for production deployment.
>
> Alhamdulillah! Thank you for watching, and I hope this demonstrates the value of building on Sanctum Gateway. JazakAllahu khairan!"

**Visual**: End with dashboard showing live metrics and connected WebSocket

---

## 📝 Recording Tips

### Technical Setup
- **Screen Resolution**: 1920x1080 or 2560x1440 (16:9 ratio)
- **Browser**: Chrome or Arc (clean, no extensions visible)
- **Zoom Level**: 100% or 110% (text should be readable)
- **Dark Mode**: Recommended (looks professional)
- **Remove Distractions**: Close unnecessary tabs, disable notifications

### Audio Setup
- **Microphone**: Use external mic if possible (better quality than laptop)
- **Environment**: Quiet room with minimal echo
- **Practice**: Rehearse once before final recording
- **Pace**: Speak clearly and not too fast

### Screen Recording
- **Tool**: OBS Studio, Loom, or QuickTime
- **Frame Rate**: 30fps minimum
- **Quality**: 1080p or higher
- **Cursor**: Show cursor, use for emphasis
- **Transitions**: Keep smooth, don't jump around too much

### Editing (Optional)
- **Cut Mistakes**: Edit out any errors or long pauses
- **Annotations**: Add text overlays for key metrics (optional)
- **Music**: Light background music (very subtle, optional)
- **Intro/Outro**: Add title card with project name (5 seconds each)

### File Export
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080p minimum
- **Max Size**: < 500MB (for easy upload)
- **Max Length**: 5 minutes (judges have limited time)

---

## 🎯 Key Messages to Emphasize

1. **Gateway's Value**: Jito-level MEV protection at RPC-level costs through dual-submission
2. **90.91% Savings**: Savings vs **always-using-Jito**, NOT vs RPC
3. **RPC is Cheapest**: Be honest that RPC is still the cheapest single option
4. **Smart Routing**: Gateway eliminates the decision - it does both automatically
5. **Production Ready**: 100% working, deployed, tested, documented
6. **Real-time**: WebSocket updates, toast notifications, live monitoring
7. **Wallet Monitoring**: Unique feature - track ANY wallet, not just yours
8. **17 Charts**: Comprehensive analytics for data-driven decisions

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Don't say "Gateway is cheaper than RPC" - it's not
2. ❌ Don't claim 90.91% savings vs RPC - it's vs always-using-Jito
3. ❌ Don't spend too long on any one feature (max 60 seconds each)
4. ❌ Don't show any bugs or loading states that hang
5. ❌ Don't use sample/mock data - use real mainnet transactions
6. ❌ Don't forget to mention Islamic expressions naturally (1-2 times)
7. ❌ Don't speak too fast - judges need to understand technical concepts
8. ❌ Don't go over 5 minutes - respect judges' time

---

## ✅ Final Checklist Before Recording

- [ ] Backend server running on port 3001 (no errors in logs)
- [ ] Frontend server running on port 3000 (compiled successfully)
- [ ] At least 1 wallet monitored with recent transactions
- [ ] WebSocket connected (green badge visible)
- [ ] Database has real data (not empty state)
- [ ] Browser DevTools closed (clean screen)
- [ ] Notifications disabled (no interruptions)
- [ ] Script rehearsed at least once (smooth delivery)
- [ ] Audio/video recording tools tested (quality check)
- [ ] Timer ready (stay under 5 minutes)

---

## 📹 Alternative: Short Version (90 seconds)

If you need a very short demo for social media:

**0:00-0:15** - Introduction + problem statement
**0:15-0:30** - Show wallet monitoring (add wallet, see toast)
**0:30-0:50** - Cost comparison chart + explain dual-submission value
**0:50-1:10** - Real-time WebSocket feed + interactive charts
**1:10-1:30** - Technical stack + production readiness + closing

---

**May this video demo effectively communicate the value of Gateway Insights and the brilliance of Sanctum Gateway's dual-submission strategy. Bismillah!**
