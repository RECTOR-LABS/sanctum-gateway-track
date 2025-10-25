'use client';

import { Play, Award, TrendingUp, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Replace with actual video URL when available
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Placeholder

  const highlights = [
    {
      icon: Award,
      title: '100% Success Rate',
      description: '11 confirmed mainnet transactions',
    },
    {
      icon: TrendingUp,
      title: '90.91% Savings',
      description: 'vs always-using-Jito approach',
    },
    {
      icon: Shield,
      title: 'MEV Protected',
      description: 'Smart dual-submission routing',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-4">
            <Badge className="text-base px-4 py-2 bg-primary/10 border-primary/30 text-primary">
              See It In Action
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Gateway Insights Demo
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how Gateway Insights transforms Solana transaction analytics with real-time monitoring and cost optimization
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <Card className="relative overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-background relative">
                  {!isPlaying ? (
                    /* Video Thumbnail/Placeholder */
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
                      <div className="text-center space-y-6 p-8">
                        {/* Play Button */}
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="group/play"
                          aria-label="Play video"
                        >
                          <div className="relative">
                            {/* Animated Rings */}
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                            <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse" />

                            {/* Play Button */}
                            <div className="relative h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform group-hover/play:scale-110">
                              <Play className="h-10 w-10 text-primary-foreground ml-1" fill="currentColor" />
                            </div>
                          </div>
                        </button>

                        {/* Video Info */}
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">
                            5-Minute Product Demo
                          </h3>
                          <p className="text-muted-foreground">
                            Discover how Gateway Insights helps developers optimize Solana transactions
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-6 text-sm">
                          <div className="flex flex-col items-center">
                            <div className="font-bold text-lg">5:24</div>
                            <div className="text-muted-foreground">Duration</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="font-bold text-lg">1080p</div>
                            <div className="text-muted-foreground">Quality</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="font-bold text-lg">EN</div>
                            <div className="text-muted-foreground">Subtitles</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Actual Video Embed */
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`${videoUrl}?autoplay=1`}
                      title="Gateway Insights Demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {/* Overlay Gradient */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
                  )}
                </div>
              </Card>

              {/* Video Description */}
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-lg">What You'll See:</h4>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Real-time wallet monitoring in action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Live transaction tracking via WebSocket</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Cost comparison across delivery methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>17 interactive analytics charts</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Key Highlights</h3>

              {highlights.map((highlight, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <highlight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold">{highlight.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* CTA */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <div className="space-y-4">
                  <h4 className="font-semibold">Ready to Try It?</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore the live dashboard and see real Solana transactions tracked in real-time.
                  </p>
                  <Button asChild className="w-full">
                    <a href="/dashboard">Launch Dashboard</a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
