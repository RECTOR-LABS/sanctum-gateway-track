'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckCircle, Loader2, AlertCircle, Wallet, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [status, setStatus] = useState<'ready' | 'running' | 'completed' | 'error'>('ready');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Poll for status when running
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo/status`);
        const data = await response.json();

        setProgress(data.progress || 0);

        // Check if demo completed
        if (!data.isRunning && data.progress >= data.total && data.total > 0) {
          setStatus('completed');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to fetch status:', err);
      }
    }, 1000); // Poll every second

    return () => clearInterval(interval);
  }, [status]);

  const startDemo = async () => {
    try {
      setStatus('running');
      setProgress(0);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: 10,
          interval: 3000,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to start demo');
      }
    } catch (err) {
      console.error('Failed to start demo:', err);
      setError(err instanceof Error ? err.message : 'Failed to start demo');
      setStatus('error');
    }
  };

  const resetDemo = () => {
    setStatus('ready');
    setProgress(0);
    setError(null);
  };

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Live Gateway Demo
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Automated transaction demo using Sanctum Gateway with real mainnet transactions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Demo Control Card */}
        <Card className="border-primary/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              Gateway Transaction Demo
            </CardTitle>
            <CardDescription>
              Send 10 real mainnet transactions through Sanctum Gateway with 3-second intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Display */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div className="text-2xl font-bold">
                    {status === 'ready' && 'Ready to Start'}
                    {status === 'running' && 'Running...'}
                    {status === 'completed' && 'Completed!'}
                    {status === 'error' && 'Error'}
                  </div>
                </div>
                {status === 'running' && (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                )}
                {status === 'completed' && (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
                {status === 'error' && (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                )}
              </div>

              {status === 'running' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <Badge variant="outline">{progress}/10 transactions</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(progress / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {status === 'error' && error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}
            </div>

            {/* Demo Info */}
            <div className="grid gap-4 grid-cols-3">
              <div className="p-4 rounded-lg border bg-card">
                <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                <div className="text-2xl font-bold">10</div>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="text-sm text-muted-foreground mb-1">Interval</div>
                <div className="text-2xl font-bold">3s</div>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="text-sm text-muted-foreground mb-1">Duration</div>
                <div className="text-2xl font-bold">~30s</div>
              </div>
            </div>

            {/* Start Button */}
            {status === 'completed' ? (
              <div className="space-y-3">
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  size="lg"
                  className="w-full text-lg py-6"
                >
                  Run Demo Again
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full text-lg py-6"
                >
                  <Link href="/analytics">
                    View Analytics
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                onClick={startDemo}
                disabled={status === 'running'}
                size="lg"
                className="w-full text-lg py-6"
              >
                {status === 'running' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Transactions...
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Try Again
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Live Gateway Demo
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Recording Instructions
            </CardTitle>
            <CardDescription>
              Follow these steps for the perfect demo video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pre-Recording Setup */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Before Recording
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">1.</span>
                  <span>Navigate to <Link href="/transactions" className="text-primary hover:underline">/transactions</Link> page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">2.</span>
                  <span>Monitor your demo wallet: <code className="text-xs bg-muted px-1 py-0.5 rounded">REC1Vu7...</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">3.</span>
                  <span>Monitor Jupiter wallet: <code className="text-xs bg-muted px-1 py-0.5 rounded">JUP4Fb2...</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">4.</span>
                  <span>Split screen: Demo page + Transactions page</span>
                </li>
              </ul>
            </div>

            {/* During Recording */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-green-500" />
                During Recording
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Click "Start Live Gateway Demo" button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Show transactions appearing in real-time (both yours and Jupiter's)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Highlight Gateway metadata (delivery method, cost)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>After completion, navigate to Analytics page</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/transactions">
                  <Wallet className="mr-2 h-4 w-4" />
                  Go to Transactions Page
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/monitor">
                  <Wallet className="mr-2 h-4 w-4" />
                  Setup Wallet Monitoring
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Information */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Wallet className="h-5 w-5" />
            Demo Cost Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Cost per Transaction</div>
              <div className="text-lg font-semibold">~0.0001 SOL</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Demo Cost</div>
              <div className="text-lg font-semibold">~0.001 SOL</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">USD Equivalent</div>
              <div className="text-lg font-semibold">~$0.14</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            These are real mainnet transactions with minimal cost. Demo wallet: <code className="bg-muted px-1 py-0.5 rounded">REC1Vu7bLQTkSDhrKcn2nTj7PayLQxBmEV1juseQ3zc</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
