'use client';

import Link from 'next/link';
import { Github, Twitter, ExternalLink, Mail, FileText, BarChart3, Zap } from 'lucide-react';

export function MarketingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Gateway Insights" className="h-8 w-8" />
              <h3 className="text-xl font-bold">Gateway Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Production-grade transaction analytics platform powered by Sanctum Gateway.
              Monitor costs, track success rates, and optimize your Solana transactions.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com/RECTOR-LABS/sanctum-gateway-track"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@rectorspace.com"
                className="h-9 w-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/transactions"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Transactions
                </Link>
              </li>
              <li>
                <Link
                  href="/monitor"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Wallet Monitor
                </Link>
              </li>
              <li>
                <Link
                  href="/pitch-deck"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Pitch Deck
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://gateway.sanctum.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Gateway API
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.sanctum.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RECTOR-LABS/sanctum-gateway-track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Source Code
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://solscan.io/tx/52g35379jXEbZtqRSXqKCxEa948ebtwz37cvGgBvNUaLD3sfb2jEhqauiX3H86Rsfh6PkdCXsak4HjZAFAaNcjx3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Mainnet Proof
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Hackathon Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Hackathon</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://earn.superteam.fun/listing/sanctum-gateway-track"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Sanctum Gateway Track
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.colosseum.org/cypherpunk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Colosseum Cypherpunk
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium mb-1">Key Metrics</div>
                  <div className="space-y-1 text-xs">
                    <div>• 90.91% Cost Savings</div>
                    <div>• 100% Success Rate</div>
                    <div>• 11 Mainnet Transactions</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Added pb-20 to prevent overlap with floating pitch deck button */}
        <div className="mt-12 pt-8 border-t pb-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Gateway Insights. Built for Sanctum Gateway Track - Colosseum Cypherpunk Hackathon.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="https://sanctum.so"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Powered by Sanctum
              </a>
              <a
                href="https://solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Built on Solana
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
