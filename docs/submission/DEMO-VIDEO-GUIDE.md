# Demo Video Recording Guide

**Project**: Gateway Insights - Sanctum Gateway Track Submission
**Target Duration**: 5 minutes
**Audience**: Hackathon judges (technical + non-technical)
**Objective**: Demonstrate Gateway integration, unique value, and production quality

---

## Pre-Recording Checklist

### Technical Setup
- [ ] Backend server running (`cd src/backend && npm run dev`)
- [ ] Frontend running (`cd src/frontend && npm run dev`)
- [ ] Browser window at 1920x1080 resolution
- [ ] Clear browser cache and disable extensions
- [ ] Test audio (clear, no background noise)
- [ ] Screen recording software ready (OBS, Loom, or QuickTime)
- [ ] Have example wallet addresses ready:
  - Your mainnet wallet: `REC1Vu7...` (with existing transactions)
  - A high-activity wallet for monitoring demo (e.g., Jupiter aggregator wallet)

### Content Preparation
- [ ] Review Gateway integration code in `src/backend/gateway/client.ts`
- [ ] Have Solscan transaction link ready: https://solscan.io/tx/52g35379j...
- [ ] Prepare 2-3 talking points per section
- [ ] Practice run-through (aim for 4:30-5:00 minutes)

---

## Video Flow & Script

### **Segment 1: Introduction (30 seconds)**

**What to show**: Landing page (homepage)

**Script**:
> "Assalamu'alaikum! I'm RECTOR, and this is Gateway Insights - a production-grade transaction analytics platform built for the Sanctum Gateway Track.
>
> The challenge: Solana developers face a trade-off between cheap RPC transactions and expensive Jito bundles for MEV protection. Gateway Insights solves this by demonstrating Gateway's smart dual-submission - getting Jito-level security at RPC-level costs through automatic refunds.
>
> Let's dive into the platform."

**Actions**:
1. Start on homepage showing hero section
2. Scroll to show key metrics (90.91% savings, 100% success rate)
3. Hover over "View Live Dashboard" button

---

### **Segment 2: Gateway Integration Proof (45 seconds)**

**What to show**:
- Code snippet in homepage OR
- GitHub repository (`src/backend/gateway/client.ts`)

**Script**:
> "First, the mandatory requirement: Gateway integration. Gateway Insights uses both `buildGatewayTransaction` and `sendTransaction` APIs on Solana mainnet.
>
> Here's the integration code - we build the transaction through Gateway's API, receive the optimized transaction, and send it. Gateway automatically decides whether to route through RPC or Jito based on the transaction characteristics.
>
> This is proven on mainnet with 11 confirmed transactions. Let me show you one."

**Actions**:
1. Show code in homepage OR open `src/backend/gateway/client.ts` lines 45-75
2. Click "View Mainnet Transaction" link
3. Show Solscan page briefly (signature, status: success, delivery method if visible)
4. Return to application

---

### **Segment 3: Real-time Dashboard (60 seconds)**

**What to show**: Dashboard page (`/dashboard`)

**Script**:
> "The Dashboard gives you instant visibility into all Gateway transactions.
>
> At the top, we have 4 key metrics: total transactions, success rate, total cost, and average response time - all real-time.
>
> Notice the delivery method breakdown - Gateway intelligently routes transactions. In my testing, sanctum-sender handled most transactions, with automatic Jito routing when needed.
>
> The transaction feed updates live via WebSocket. Each transaction shows the signature, delivery method, cost, status, and timestamp. You can click any transaction to see it on Solscan."

**Actions**:
1. Navigate to `/dashboard`
2. Point to each metric card
3. Highlight the delivery method distribution (pie chart or percentages)
4. Scroll through transaction feed
5. Click one transaction to open Solscan in new tab (quickly show and close)
6. Show real-time update (if possible, trigger a new transaction)

---

### **Segment 4: Cost Analysis & Savings (60 seconds)**

**What to show**: Analytics page (`/analytics`) - Cost Analysis section

**Script**:
> "This is where Gateway's value becomes clear. The Cost Analysis section compares three approaches: RPC, Jito, and Gateway.
>
> Cost Breakdown shows actual costs from my transactions. Gateway delivered all 11 transactions successfully, with most going through sanctum-sender.
>
> The Savings Calculator demonstrates the key insight: Gateway's dual-submission with automatic refunds means you get Jito-level MEV protection, but when RPC wins, you're refunded the Jito tip. This resulted in 90.91% savings compared to always using Jito.
>
> For high-volume apps like Jupiter processing millions of transactions, this translates to hundreds of thousands of dollars in annual savings - exactly what Gateway enables."

**Actions**:
1. Navigate to `/analytics`
2. Scroll to Cost Analysis section (now vertical layout)
3. Point to Cost Breakdown metrics
4. Scroll to Savings Calculator
5. Highlight the 90.91% savings metric
6. Show the cost comparison bars/chart

---

### **Segment 5: Advanced Analytics (45 seconds)**

**What to show**: Analytics page - charts and trends

**Script**:
> "Gateway Insights includes 17 interactive charts for deep analysis.
>
> Success rates by delivery method - as you can see, sanctum-sender achieved 100% success in my testing.
>
> Historical trends show transaction volume and cost patterns over time.
>
> Response time analysis breaks down P50, P95, and P99 percentiles - critical for understanding real-world performance.
>
> Failure analysis categorizes errors when they occur, helping developers optimize their transaction strategy."

**Actions**:
1. Scroll to Success Rates section (show bar chart)
2. Show Historical Trends charts (volume over time, cost trends)
3. Point to Response Time Analysis (P50/P95/P99 metrics)
4. Show Failure Analysis section (even if empty, explain the categories)

---

### **Segment 6: Wallet Monitoring (45 seconds)**

**What to show**: Monitor page (`/monitor`)

**Script**:
> "One unique feature: wallet monitoring without wallet connection. You can monitor ANY Solana address.
>
> Let me add a wallet. I'll paste a Solana address, click 'Start Monitoring', and Gateway Insights immediately fetches all historical transactions and starts tracking new ones in real-time via WebSocket.
>
> Each transaction shows the same detailed analytics - delivery method, cost, status. This works with Helius RPC for reliable, rate-limit-free tracking."

**Actions**:
1. Navigate to `/monitor`
2. Copy a wallet address (prepare beforehand)
3. Paste into input field (show client-side validation if it highlights valid format)
4. Click "Start Monitoring"
5. Show the wallet appearing in the monitored list
6. Show transactions loading
7. Point to a few transactions and their details

---

### **Segment 7: Production Quality (30 seconds)**

**What to show**:
- Pitch Deck page (`/pitch-deck`) OR
- Quickly show tech stack section

**Script**:
> "Gateway Insights is production-ready. Built with Next.js 15, React 19, TypeScript strict mode with zero errors, PostgreSQL for persistence, Redis for caching, and WebSocket for real-time updates.
>
> The backend exposes 10 REST APIs, all with proper error handling, input validation, and SQL injection protection. The frontend has 36 React components, all responsive with dark mode support."

**Actions**:
1. Navigate to `/pitch-deck` (if showing) or stay on current page
2. Briefly scroll to show polish and responsiveness
3. Toggle dark mode (if you have a toggle visible)
4. Show one or two charts interacting smoothly

---

### **Segment 8: Conclusion & Call to Action (15 seconds)**

**What to show**: Landing page or Pitch Deck final slide

**Script**:
> "Gateway Insights proves Gateway's value: smart dual-submission, automatic refunds, 90% cost savings, and comprehensive analytics - all production-ready.
>
> Check out the live demo at [your-vercel-url.vercel.app], explore the code on GitHub, and see why Gateway is the future of Solana transaction delivery. JazakAllahu khairan!"

**Actions**:
1. Navigate back to homepage or pitch deck summary
2. Show GitHub link
3. End with homepage hero section or pitch deck thank you slide

---

## Recording Tips

### Technical
1. **Use 1080p resolution** - Clearer for judges to read text
2. **Full screen browser** - Hide bookmarks bar, use F11 or presentation mode
3. **Clear audio** - Use external microphone if possible, speak clearly
4. **Smooth navigation** - Practice transitions between pages to avoid fumbling
5. **Disable notifications** - Turn off Slack, email, OS notifications during recording

### Presentation
1. **Speak confidently** - You built this, you know it well
2. **Pace yourself** - Don't rush, but stay within 5 minutes
3. **Show, don't just tell** - Click buttons, scroll, interact with charts
4. **Highlight Gateway specifics** - Always tie back to Gateway integration and value
5. **Be authentic** - Your passion for the project comes through

### Content
1. **Focus on Gateway requirements** - Integration proof, value demonstration, optional tooling
2. **Emphasize production quality** - Not just a prototype, this is deployable
3. **Show real data** - 11 mainnet transactions, actual cost savings, real charts
4. **Demonstrate uniqueness** - Wallet monitoring, 17 charts, WebSocket real-time, cost comparison

---

## Editing Checklist

After recording:

- [ ] Trim dead air at beginning/end
- [ ] Add title card: "Gateway Insights - Sanctum Gateway Track Submission"
- [ ] Add your GitHub username and links in description
- [ ] Add timestamps in description for each segment
- [ ] Export at 1080p, 30fps minimum
- [ ] Check audio levels (not too quiet or too loud)
- [ ] Total duration: 4:30 - 5:30 (ideal: 5:00)

---

## YouTube Upload Details

**Title**: Gateway Insights - Sanctum Gateway Track Submission | Solana Analytics Platform

**Description**:
```
Gateway Insights - Production-grade transaction analytics for Solana developers

🏆 Sanctum Gateway Track Submission - Colosseum Cypherpunk Hackathon

✨ Key Features:
• Gateway Integration (buildGatewayTransaction + sendTransaction) ✅
• 90.91% cost savings vs always-using-Jito
• Real-time wallet monitoring via WebSocket
• 17 interactive analytics charts
• 100% success rate on 11 mainnet transactions

🔗 Links:
• Live Demo: [your-vercel-url]
• GitHub: https://github.com/RECTOR-LABS/sanctum-gateway-track
• Mainnet Proof: https://solscan.io/tx/52g35379j...

📊 Tech Stack:
• Frontend: Next.js 15, React 19, TypeScript
• Backend: Node.js, Express, PostgreSQL, Redis
• Blockchain: Sanctum Gateway SDK, Solana web3.js, Helius RPC

Timestamps:
0:00 Introduction
0:30 Gateway Integration Proof
1:15 Real-time Dashboard
2:15 Cost Analysis & Savings
3:00 Advanced Analytics
3:45 Wallet Monitoring
4:30 Production Quality
4:45 Conclusion

Built by RECTOR for Sanctum Gateway Track
```

**Tags**:
`Solana`, `Sanctum`, `Gateway`, `Blockchain`, `Web3`, `Analytics`, `Hackathon`, `Cypherpunk`, `DeFi`, `Transaction`, `MEV`, `Jito`

**Thumbnail Ideas**:
- Gateway Insights logo + "90.91% Savings"
- Dashboard screenshot with "Real-time Analytics"
- Cost comparison chart with "Gateway vs RPC vs Jito"

---

## Alternative: Screen + Webcam Recording

If you prefer showing your face:
1. Use OBS or Loom to record screen + webcam simultaneously
2. Position webcam in bottom-right corner (small, not obstructive)
3. Maintain eye contact with camera when speaking
4. Dress professionally (even if just upper body visible)
5. Ensure good lighting on your face

This adds personal touch but is **optional** - screen-only recording is perfectly fine for technical demos.

---

## Final Reminders

- **Test recording setup** - Do a 30-second test first
- **Have fun** - You built something amazing, be proud!
- **Stay within time** - Judges appreciate concise, focused demos
- **Backup plan** - If live demo fails, have screenshots ready
- **Upload early** - Don't wait until deadline day

**May Allah grant you success in this submission. Bismillah!** 🚀

---

**Questions?**
- Review this guide 24 hours before recording
- Practice the flow 2-3 times
- Record during your most energetic time of day
- Take breaks between attempts if needed

**Alhamdulillah, you're ready to record an excellent demo!**
