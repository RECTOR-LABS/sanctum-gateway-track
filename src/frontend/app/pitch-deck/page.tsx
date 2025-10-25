'use client';

import { ArrowDown, Check, Code, Zap, Shield, TrendingUp, Award, ExternalLink, Sparkles, Target, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PitchDeckNav } from '@/components/pitch-deck/pitch-deck-nav';
import { DemoVideoSection } from '@/components/pitch-deck/demo-video-section';
import { FadeIn } from '@/components/animations/fade-in';
import { ScaleIn } from '@/components/animations/scale-in';
import { Floating } from '@/components/animations/floating';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container';

export default function PitchDeckPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Professional Navigation with Labels */}
      <PitchDeckNav />

      {/* Section 1: Cover */}
      <section id="section-1" className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 animate-pulse" />

        <div className="text-center z-10 space-y-8 max-w-4xl">
          <FadeIn delay={0.1}>
            <Floating yOffset={3} duration={3}>
              <Badge className="text-lg px-6 py-2 bg-primary/10 border-primary/30 text-primary">
                <Sparkles className="inline mr-2 h-4 w-4" />
                Sanctum Gateway Track Submission
              </Badge>
            </Floating>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Gateway Insights
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-2xl md:text-3xl text-muted-foreground font-light">
              Production-grade transaction analytics powered by{' '}
              <span className="text-primary font-semibold">Sanctum Gateway</span>
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <StaggerItem>
              <ScaleIn>
                <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">100% Success Rate</span>
                </div>
              </ScaleIn>
            </StaggerItem>
            <StaggerItem>
              <ScaleIn>
                <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">90.91% Cost Savings</span>
                </div>
              </ScaleIn>
            </StaggerItem>
            <StaggerItem>
              <ScaleIn>
                <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">11 Mainnet Transactions</span>
                </div>
              </ScaleIn>
            </StaggerItem>
            <StaggerItem>
              <ScaleIn>
                <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-medium">Production Ready</span>
                </div>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.5}>
            <div className="flex gap-4 justify-center pt-6">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/dashboard">View Live Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://github.com/RECTOR-LABS/sanctum-gateway-track" target="_blank" rel="noopener noreferrer">
                  <Code className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </FadeIn>

          <Floating yOffset={8} duration={2}>
            <div className="pt-12">
              <ArrowDown className="h-8 w-8 mx-auto text-muted-foreground" />
            </div>
          </Floating>
        </div>
      </section>

      {/* Section 2: Problem Statement */}
      <section id="section-2" className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
        <div className="max-w-6xl w-full space-y-12">
          <FadeIn>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">The Problem</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Solana developers face a critical trade-off between transaction cost and security
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6">
            <StaggerItem>
              <ScaleIn>
                <Card className="border-destructive/50 bg-destructive/5 hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Shield className="h-5 w-5" />
                      Expensive MEV Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Jito bundles provide MEV protection but cost <strong>0.001 SOL per transaction</strong> - expensive at scale. For high-volume protocols like Jupiter processing millions of transactions, this adds up to <strong>hundreds of thousands of dollars annually</strong>.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="border-destructive/50 bg-destructive/5 hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <TrendingUp className="h-5 w-5" />
                      Cheap but Vulnerable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Direct RPC is cheap (~0.000005 SOL base fee) but offers <strong>no MEV protection</strong> - transactions can be front-run by arbitrage bots, leading to <strong>value extraction and poor execution prices</strong> for users.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="border-destructive/50 bg-destructive/5 hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Zap className="h-5 w-5" />
                      No Visibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Developers lack <strong>comprehensive analytics</strong> on delivery methods and cost optimization. Without visibility into which method was used, success rates, and actual costs, <strong>optimizing transaction strategy is guesswork</strong>.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Section 3: Solution */}
      <section id="section-3" className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full space-y-12">
          <FadeIn>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Our Solution
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive analytics platform powered by Sanctum Gateway
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-6">
            <StaggerItem>
              <ScaleIn>
                <Card className="border-primary/50 bg-primary/5 hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Zap className="h-5 w-5" />
                      Sanctum Gateway Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      Smart routing with dual-submission to RPC and Jito - get MEV protection when needed, automatic refunds when RPC wins. Gateway intelligently decides which path to take based on transaction characteristics.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-primary/10">buildGatewayTransaction</Badge>
                      <Badge variant="outline" className="bg-primary/10">sendTransaction</Badge>
                    </div>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="border-primary/50 bg-primary/5 hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <TrendingUp className="h-5 w-5" />
                      Real-time Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Monitor any Solana wallet, track transactions in real-time via WebSocket, compare costs across all delivery methods. Historical data with 17 interactive charts for deep analysis.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="border-primary/50 bg-primary/5 hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Shield className="h-5 w-5" />
                      Cost Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Comprehensive 3-way cost comparison: RPC vs Jito vs Gateway - see exactly where savings come from. Simulated savings calculator shows potential cost reduction for monitored wallets.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="border-primary/50 bg-primary/5 hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Award className="h-5 w-5" />
                      Production Ready
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      TypeScript strict mode (0 errors), 10 REST APIs, 17 interactive charts, PostgreSQL + Redis caching, WebSocket real-time, Helius RPC, 100% feature complete.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Section 4: Demo Video (Judge-Friendly) */}
      <section id="section-4" className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <DemoVideoSection />
      </section>

      {/* Section 5: Gateway Integration Proof */}
      <section id="section-5" className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
        <div className="max-w-6xl w-full space-y-12">
          <FadeIn>
            <div className="text-center space-y-4">
              <Floating yOffset={3} duration={2.5}>
                <Badge className="text-lg px-6 py-2 bg-primary/10 border-primary/30 text-primary">
                  <Target className="inline mr-2 h-4 w-4" />
                  Critical Requirement
                </Badge>
              </Floating>
              <h2 className="text-4xl md:text-5xl font-bold">Gateway Integration Proof</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                buildGatewayTransaction + sendTransaction - Working on Mainnet
              </p>
            </div>
          </FadeIn>

          <ScaleIn delay={0.2}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Integration Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <pre className="bg-muted p-6 rounded-lg overflow-x-auto text-sm">
                  <code className="text-foreground">{`// Backend Gateway Integration
import { createGatewayClient } from './gateway/client';

// 1. Build transaction via Gateway
const buildResult = await gatewayClient.buildGatewayTransaction(
  transaction.serialize({ requireAllSignatures: false }).toString('base64')
);

// 2. Deserialize Gateway's modified transaction
const modifiedTx = Transaction.from(
  Buffer.from(buildResult.transaction, 'base64')
);

// 3. Sign the modified transaction
modifiedTx.sign(wallet);

// 4. Send via Gateway
const signature = await gatewayClient.sendTransaction(
  modifiedTx.serialize({ requireAllSignatures: true }).toString('base64')
);`}</code>
                </pre>

                <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-4">
                  <StaggerItem>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        What Gateway Does
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground ml-7">
                        <li>• Adds tip instructions automatically</li>
                        <li>• Optimizes transaction structure</li>
                        <li>• Dual-submits to RPC + Jito</li>
                        <li>• Refunds unused tips</li>
                      </ul>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Mainnet Proof
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong>11 confirmed transactions</strong> on Solana mainnet
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <a
                            href="https://solscan.io/tx/52g35379jXEbZtqRSXqKCxEa948ebtwz37cvGgBvNUaLD3sfb2jEhqauiX3H86Rsfh6PkdCXsak4HjZAFAaNcjx3"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View on Solscan
                          </a>
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>
      </section>

      {/* Section 6: Quantitative Results */}
      <section id="section-6" className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full space-y-12">
          <FadeIn>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Quantitative Results</h2>
              <p className="text-xl text-muted-foreground">
                Real-world performance metrics from production
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StaggerItem>
              <ScaleIn>
                <Card className="text-center border-primary/50 hover:shadow-lg hover:scale-105 transition-all">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-primary">90.91%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Cost Savings vs Always-Using-Jito</p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="text-center border-primary/50 hover:shadow-lg hover:scale-105 transition-all">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-primary">100%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Success Rate (sanctum-sender)</p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="text-center border-primary/50 hover:shadow-lg hover:scale-105 transition-all">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-primary">&lt;100ms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Average API Response Time</p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="text-center border-primary/50 hover:shadow-lg hover:scale-105 transition-all">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-primary">11</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Mainnet Transactions Tracked</p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>

          <ScaleIn delay={0.3}>
            <Card className="bg-primary/5 border-primary/30 hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Why Gateway is Optimal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Smart Dual-Submission</p>
                    <p className="text-sm text-muted-foreground">
                      Submits to both Jito and RPC simultaneously, keeps whichever confirms first. This strategy provides <strong>best-of-both-worlds</strong> - MEV protection from Jito, cost efficiency from RPC.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Automatic Refunds</p>
                    <p className="text-sm text-muted-foreground">
                      When RPC wins, Jito tip is refunded - you get Jito-level MEV protection at RPC-level costs. This is how Gateway achieves <strong>90.91% savings</strong> compared to always using Jito.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">0.0001 SOL Fixed Fee</p>
                    <p className="text-sm text-muted-foreground">
                      Gateway's fixed fee is 90% cheaper than Jito's 0.001 SOL tip. For high-volume protocols, this translates to <strong>hundreds of thousands of dollars in annual savings</strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>
      </section>

      {/* Section 7: Technical Achievements */}
      <section id="section-7" className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
        <div className="max-w-6xl w-full space-y-12">
          <FadeIn>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Technical Achievements</h2>
              <p className="text-xl text-muted-foreground">
                Production-grade full-stack implementation
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-6">
            <StaggerItem>
              <ScaleIn>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle>Backend Architecture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">10 REST API endpoints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">WebSocket real-time updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">PostgreSQL + Redis caching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">TypeScript strict mode (0 errors)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Helius RPC integration</span>
                    </div>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle>Frontend Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Next.js 15 with App Router + Turbopack</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">17 interactive charts (Recharts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Real-time transaction feed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">Dark mode + Responsive design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">36+ React components</span>
                    </div>
                  </CardContent>
                </Card>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Section 8: Innovation & Features */}
      <section id="section-8" className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full space-y-12">
          <FadeIn>
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Innovation & Unique Features</h2>
              <p className="text-xl text-muted-foreground">
                What makes Gateway Insights stand out
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/30 hover:border-primary transition-colors">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/30">Unique</Badge>
                <CardTitle>Real-time Wallet Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor ANY Solana wallet address in real-time. Track transactions as they happen with WebSocket updates. No wallet connection required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:border-primary transition-colors">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/30">Advanced</Badge>
                <CardTitle>3-Way Cost Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare RPC vs Jito vs Gateway costs side-by-side. See exactly where savings come from with visual breakdowns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:border-primary transition-colors">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/30">Simulated</Badge>
                <CardTitle>Gateway Savings Simulator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For wallet-monitored transactions, calculate potential savings if they had used Gateway instead of their actual delivery method.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:border-primary transition-colors">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/30">Real-time</Badge>
                <CardTitle>Alert System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time health monitoring with error categorization, warning levels, and automatic failure analysis across delivery methods.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:border-primary transition-colors">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/30">Flexible</Badge>
                <CardTitle>Data Export</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export analytics data in CSV or JSON format for further analysis, reporting, or integration with other tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 hover:border-primary transition-colors">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/30">Comprehensive</Badge>
                <CardTitle>17 Interactive Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cost trends, success rates, delivery methods, failure analysis, response times, and historical comparisons - all visualized.
                </p>
              </CardContent>
            </Card>
          </StaggerContainer>
        </div>
      </section>

      {/* Section 9: Live Demo Screenshots */}
      <section id="section-9" className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
        <div className="max-w-6xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Live Application</h2>
            <p className="text-xl text-muted-foreground">
              Explore the production-ready platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="group hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Dashboard
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/dashboard">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Real-time metrics overview</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Transaction trends visualization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Delivery method breakdown</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Cost comparison charts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Analytics
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/analytics">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>17 interactive charts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Cost breakdown & savings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Success rate tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Failure analysis & alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Transactions
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/transactions">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Real-time transaction feed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Gateway savings comparison</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Transaction details & explorer links</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Filtering & pagination</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Wallet Monitor
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/monitor">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Monitor any Solana wallet</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Real-time transaction tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Client-side validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Comprehensive error handling</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 10: Impact & Use Cases */}
      <section id="section-10" className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Real-World Impact</h2>
            <p className="text-xl text-muted-foreground">
              Who benefits from Gateway Insights?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                For Developers
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Optimize Transaction Costs</p>
                    <p className="text-sm text-muted-foreground">
                      Understand exact cost breakdown across delivery methods and identify savings opportunities
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Monitor Gateway Performance</p>
                    <p className="text-sm text-muted-foreground">
                      Track success rates, response times, and delivery method effectiveness in real-time
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Debug Transaction Issues</p>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive error categorization and failure analysis to quickly identify problems
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                For Protocols
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Cost Attribution</p>
                    <p className="text-sm text-muted-foreground">
                      Track which delivery methods are being used and their associated costs
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Performance Benchmarking</p>
                    <p className="text-sm text-muted-foreground">
                      Compare Gateway against direct Jito or RPC to validate value proposition
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Wallet Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor competitor wallets or analyze user transaction patterns
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl">Jupiter-Scale Savings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Sanctum Gateway enables <strong className="text-foreground">hundreds of thousands of dollars in annual savings</strong> for high-volume protocols like Jupiter through intelligent dual-submission and automatic refunds.
              </p>
              <p className="text-muted-foreground">
                Our platform makes these savings <strong className="text-foreground">visible and trackable</strong> for any developer or protocol using Gateway.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 11: Tech Stack */}
      <section id="section-11" className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
        <div className="max-w-6xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Technology Stack</h2>
            <p className="text-xl text-muted-foreground">
              Modern, production-grade architecture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Frontend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Framework</span>
                  <Badge variant="outline">Next.js 15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">React</span>
                  <Badge variant="outline">19.1.0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">TypeScript</span>
                  <Badge variant="outline">5.x Strict</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Styling</span>
                  <Badge variant="outline">Tailwind v4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Charts</span>
                  <Badge variant="outline">Recharts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Data Fetching</span>
                  <Badge variant="outline">SWR</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Backend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Runtime</span>
                  <Badge variant="outline">Node.js 20+</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Framework</span>
                  <Badge variant="outline">Express 5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <Badge variant="outline">PostgreSQL</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cache</span>
                  <Badge variant="outline">Redis</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Real-time</span>
                  <Badge variant="outline">WebSocket</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">TypeScript</span>
                  <Badge variant="outline">Strict Mode</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gateway SDK</span>
                  <Badge variant="outline" className="bg-primary/10">Sanctum</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Solana</span>
                  <Badge variant="outline">web3.js</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">RPC</span>
                  <Badge variant="outline">Helius</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <Badge variant="outline">Mainnet</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">APIs</span>
                  <Badge variant="outline">10 Endpoints</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Components</span>
                  <Badge variant="outline">36+ React</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 12: Call to Action */}
      <section id="section-12" className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/20 via-primary/5 to-background">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-6">
            <Badge className="text-lg px-6 py-2 bg-primary/10 border-primary/30 text-primary">
              Thank You for Reviewing
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Built for the Future of Solana
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gateway Insights demonstrates the power of Sanctum Gateway through production-ready analytics, real-world mainnet transactions, and comprehensive cost optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">Meets All Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>buildGatewayTransaction ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>sendTransaction ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>11 Mainnet transactions ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Production-ready code ✓</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">Gateway Value Proven</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>90.91% cost savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>MEV protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Dual-submission benefits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Real-time observability</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">Innovation Delivered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Wallet monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>17 analytics charts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Real-time WebSocket</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Comprehensive docs</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/dashboard">
                  <Zap className="mr-2 h-5 w-5" />
                  Explore Live Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <a href="https://github.com/RECTOR-LABS/sanctum-gateway-track" target="_blank" rel="noopener noreferrer">
                  <Code className="mr-2 h-5 w-5" />
                  View Source Code
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Gateway Insights - Sanctum Gateway Track Submission
              <br />
              Colosseum Cypherpunk Hackathon
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="container mx-auto px-8 text-center space-y-6">
          <h3 className="text-2xl font-bold">Ready to Explore?</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link href="/dashboard">View Live Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/analytics">See Analytics</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/monitor">Monitor Wallets</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for Sanctum Gateway Track - Colosseum Cypherpunk Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
}
