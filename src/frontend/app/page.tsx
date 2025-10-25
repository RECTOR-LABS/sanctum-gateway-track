'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, TrendingUp, Shield, BarChart3, Clock, Check, Code, ExternalLink, FileText } from 'lucide-react';
import { MarketingNav } from '@/components/marketing/marketing-nav';
import { VideoSectionEnhanced } from '@/components/marketing/video-section-enhanced';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { FadeIn } from '@/components/animations/fade-in';
import { ScaleIn } from '@/components/animations/scale-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Marketing Navigation */}
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/10 border-b">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <FadeIn delay={0.1}>
              <Badge className="text-base px-4 py-2 bg-primary/10 border-primary/30 text-primary">
                Sanctum Gateway Track - Cypherpunk Hackathon
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Gateway Insights
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Production-grade transaction analytics platform powered by <span className="text-primary font-semibold">Sanctum Gateway</span>
              </p>
            </FadeIn>

            <StaggerContainer staggerDelay={0.1}>
              <div className="flex flex-wrap gap-3 justify-center text-sm">
                <StaggerItem>
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-medium">90.91% Cost Savings</span>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-medium">100% Success Rate</span>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-medium">11 Mainnet Transactions</span>
                  </div>
                </StaggerItem>
              </div>
            </StaggerContainer>

            <FadeIn delay={0.5}>
              <div className="flex gap-4 justify-center flex-wrap pt-6">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/dashboard">
                  <Zap className="mr-2 h-5 w-5" />
                  Launch Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/pitch-deck">
                  <FileText className="mr-2 h-5 w-5" />
                  View Pitch Deck
                </Link>
              </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Gateway Insights?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive analytics and cost optimization for Solana developers using Sanctum Gateway
              </p>
            </div>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <StaggerItem>
              <ScaleIn>
                <Card className="border-primary/30 hover:border-primary transition-colors h-full">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Cost Optimization</CardTitle>
                <CardDescription>
                  Compare RPC vs Jito vs Gateway - see exactly where your savings come from with 3-way cost analysis
                </CardDescription>
              </CardHeader>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="border-primary/30 hover:border-primary transition-colors h-full">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>MEV Protection</CardTitle>
                <CardDescription>
                  Gateway's smart dual-submission provides Jito-level MEV protection at RPC-level costs through automatic refunds
                </CardDescription>
              </CardHeader>
                </Card>
              </ScaleIn>
            </StaggerItem>

            <StaggerItem>
              <ScaleIn>
                <Card className="border-primary/30 hover:border-primary transition-colors h-full">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Monitor any Solana wallet, track transactions via WebSocket, and visualize data with 17 interactive charts
                </CardDescription>
              </CardHeader>
                </Card>
              </ScaleIn>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Feature Set</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to optimize Solana transaction costs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex gap-3">
              <Check className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Real-time Wallet Monitoring</p>
                <p className="text-sm text-muted-foreground">Monitor any Solana address without wallet connection</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Check className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Gateway Integration</p>
                <p className="text-sm text-muted-foreground">buildGatewayTransaction + sendTransaction working on mainnet</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Check className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">17 Interactive Charts</p>
                <p className="text-sm text-muted-foreground">Cost trends, success rates, delivery methods, response times</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Check className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">WebSocket Real-time Updates</p>
                <p className="text-sm text-muted-foreground">Transactions appear instantly with live data streaming</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Check className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Comprehensive Error Analysis</p>
                <p className="text-sm text-muted-foreground">Categorize failures, track alerts, monitor health</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Check className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Data Export</p>
                <p className="text-sm text-muted-foreground">Export analytics to CSV or JSON for further analysis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Video Section */}
      <VideoSectionEnhanced />

      {/* Gateway Integration Proof */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 border-primary/30 text-primary">
                Hackathon Requirement
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Gateway Integration Proven</h2>
              <p className="text-lg text-muted-foreground">
                buildGatewayTransaction + sendTransaction confirmed on Solana mainnet
              </p>
            </div>

            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Integration Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{`// Build transaction via Gateway
const buildResult = await gatewayClient.buildGatewayTransaction(
  transaction.serialize({ requireAllSignatures: false }).toString('base64')
);

// Send via Gateway
const signature = await gatewayClient.sendTransaction(
  modifiedTx.serialize({ requireAllSignatures: true }).toString('base64')
);`}</code>
                </pre>

                <div className="flex gap-4 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <a href="https://solscan.io/tx/52g35379jXEbZtqRSXqKCxEa948ebtwz37cvGgBvNUaLD3sfb2jEhqauiX3H86Rsfh6PkdCXsak4HjZAFAaNcjx3" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      View Mainnet Transaction
                    </a>
                  </Button>
                  <Badge variant="outline" className="bg-primary/10">
                    11 Confirmed Transactions
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Production-Ready Stack</h2>
            <p className="text-lg text-muted-foreground">
              Modern technologies, TypeScript strict mode, 0 errors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frontend</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>• Next.js 15 + React 19</p>
                <p>• TypeScript Strict Mode</p>
                <p>• Tailwind CSS v4</p>
                <p>• 36+ React Components</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Backend</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>• Node.js + Express 5</p>
                <p>• PostgreSQL + Redis</p>
                <p>• WebSocket Real-time</p>
                <p>• 10 REST Endpoints</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blockchain</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>• Sanctum Gateway SDK</p>
                <p>• Solana web3.js</p>
                <p>• Helius RPC</p>
                <p>• Mainnet Verified</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Solana Transactions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the live dashboard, monitor wallets, and see Gateway's value proposition in action
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                Explore Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/analytics">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <a href="https://github.com/RECTOR-LABS/sanctum-gateway-track" target="_blank" rel="noopener noreferrer">
                <Code className="mr-2 h-5 w-5" />
                View Code
              </a>
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t">
            <p className="text-sm text-muted-foreground">
              Gateway Insights - Sanctum Gateway Track Submission
              <br />
              Colosseum Cypherpunk Hackathon
            </p>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <MarketingFooter />
    </div>
  );
}
