'use client';

import { Play, Award, TrendingUp, Shield, Sparkles, Zap, Check, ExternalLink, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

export function DemoVideoSection() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Video configurations
  const videos = [
    {
      id: 'demo',
      title: 'Product Demo',
      description: 'Complete walkthrough of Gateway Insights features',
      url: 'https://www.youtube.com/embed/KrnDXF7_W4Q',
      duration: '2:40',
    },
    {
      id: 'integration',
      title: 'Gateway Integration',
      description: 'Deep dive into Sanctum Gateway SDK integration',
      url: 'https://www.youtube.com/embed/BIFKtY0w8gs',
      duration: '2:51',
    },
  ];

  const demoHighlights = [
    {
      icon: Video,
      title: 'Gateway Integration',
      description: 'buildGatewayTransaction + sendTransaction in action',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Live WebSocket updates with 17 interactive charts',
    },
    {
      icon: Shield,
      title: 'Cost Optimization',
      description: '90.91% savings vs always-using-Jito demonstrated',
    },
    {
      icon: Award,
      title: 'Wallet Monitoring',
      description: 'Monitor any Solana address without wallet connection',
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="text-lg px-6 py-3 bg-primary/10 border-primary/30 text-primary">
            <Video className="mr-2 h-5 w-5 inline" />
            Product Demonstration
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Demo Videos
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch the complete walkthrough of Gateway Insights features, integrations, and value proposition
          </p>
        </div>

        {/* Tabs for Video Selection */}
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-auto p-1 bg-muted/50 backdrop-blur-sm">
            {videos.map((video) => (
              <TabsTrigger
                key={video.id}
                value={video.id}
                className="flex items-center gap-2 py-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30"
              >
                <Video className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold text-base">{video.title}</div>
                  <div className="text-xs opacity-70">{video.duration}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {videos.map((video) => (
            <TabsContent key={video.id} value={video.id} className="mt-0">
              {/* Video Player - Full Width for Maximum Visibility */}
              <Card className="relative overflow-hidden border-2 border-primary/30 shadow-2xl">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 opacity-50 blur-xl" />

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                    {playingVideo !== video.id ? (
                      /* Video Thumbnail - Judge-Friendly */
                      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-gradient-to-br from-background/95 via-background/90 to-background/95">
                        <div className="text-center space-y-8 p-8">
                          {/* Large Prominent Play Button */}
                          <div className="relative inline-block">
                            {/* Animated Ripple Rings */}
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute inset-0 rounded-full border-4 border-primary animate-ping"
                                style={{
                                  animationDelay: `${i * 0.4}s`,
                                  animationDuration: '2.5s',
                                }}
                              />
                            ))}

                            {/* Play Button */}
                            <button
                              onClick={() => setPlayingVideo(video.id)}
                              className="relative group/play"
                              aria-label={`Play ${video.title}`}
                            >
                              <div className="h-32 w-32 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/60 transition-all duration-300 group-hover/play:scale-110 group-hover/play:shadow-primary/80">
                                <Play className="h-16 w-16 text-primary-foreground ml-2" fill="currentColor" />
                              </div>
                            </button>
                          </div>

                          {/* Video Info */}
                          <div className="space-y-4">
                            <h3 className="text-3xl md:text-4xl font-bold">
                              {video.title}
                            </h3>
                            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                              {video.description}
                            </p>
                          </div>

                          {/* Stats Pills */}
                          <div className="flex flex-wrap justify-center gap-4">
                            <div className="px-6 py-3 rounded-full bg-primary/10 border-2 border-primary/30 backdrop-blur-sm">
                              <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{video.duration} Duration</span>
                              </div>
                            </div>
                            <div className="px-6 py-3 rounded-full bg-primary/10 border-2 border-primary/30 backdrop-blur-sm">
                              <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <span className="font-semibold">1080p HD Quality</span>
                              </div>
                            </div>
                            <div className="px-6 py-3 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 backdrop-blur-sm">
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-emerald-500" />
                                <span className="font-semibold">Hackathon Submission</span>
                              </div>
                            </div>
                          </div>

                          {/* Judge CTA */}
                          <div className="pt-4">
                            <Button
                              size="lg"
                              className="text-lg px-12 py-6 shadow-xl shadow-primary/30"
                              onClick={() => setPlayingVideo(video.id)}
                            >
                              <Play className="mr-3 h-6 w-6" fill="currentColor" />
                              Watch {video.title} Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Actual Video Embed */
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`${video.url}?autoplay=1`}
                        title={`${video.title} - Hackathon Submission`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* What's Covered in the Demo */}
        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-primary" />
              What's Covered in This Demo
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {demoHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <highlight.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {highlight.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Additional Resources for Judges */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <div className="p-8 text-center space-y-6">
            <h3 className="text-2xl font-bold">Additional Resources for Judges</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the live application, view source code, and verify mainnet transactions
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="outline" className="text-base">
                <a href="/dashboard" target="_blank">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Live Dashboard
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="text-base">
                <a href="https://github.com/RECTOR-LABS/sanctum-gateway-track" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Source Code
                </a>
              </Button>

              <Button asChild size="lg" variant="outline" className="text-base">
                <a href="https://solscan.io/tx/52g35379jXEbZtqRSXqKCxEa948ebtwz37cvGgBvNUaLD3sfb2jEhqauiX3H86Rsfh6PkdCXsak4HjZAFAaNcjx3" target="_blank" rel="noopener noreferrer">
                  <Award className="mr-2 h-5 w-5" />
                  Mainnet Proof
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
