'use client';

import { Play, Award, TrendingUp, Shield, Sparkles, Zap, Check, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { FadeIn } from '@/components/animations/fade-in';
import { ScaleIn } from '@/components/animations/scale-in';
import { Floating } from '@/components/animations/floating';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container';

export function VideoSectionEnhanced() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Video configurations
  const videos = [
    {
      id: 'demo',
      title: 'Product Demo',
      description: 'Complete walkthrough of Gateway Insights features',
      url: 'https://www.youtube.com/embed/KrnDXF7_W4Q',
      duration: '2:40',
      highlights: [
        'Real-time wallet monitoring in action',
        'Live transaction tracking via WebSocket',
        'Cost comparison across delivery methods',
        '17 interactive analytics charts',
      ],
    },
    {
      id: 'integration',
      title: 'Gateway Integration',
      description: 'Deep dive into Sanctum Gateway SDK integration',
      url: 'https://www.youtube.com/embed/BIFKtY0w8gs',
      duration: '2:51',
      highlights: [
        'buildGatewayTransaction implementation',
        'sendTransaction flow explained',
        'Mainnet transaction verification',
        'Cost optimization strategies',
      ],
    },
  ];

  const highlights = [
    {
      icon: Award,
      title: '100% Success Rate',
      description: '11 confirmed mainnet transactions',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
    {
      icon: TrendingUp,
      title: '90.91% Savings',
      description: 'vs always-using-Jito approach',
      color: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
    },
    {
      icon: Shield,
      title: 'MEV Protected',
      description: 'Smart dual-submission routing',
      color: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <FadeIn>
            <div className="text-center mb-16 space-y-6">
              <Floating yOffset={5} duration={2}>
                <Badge className="text-base px-6 py-2 bg-primary/10 border-primary/30 text-primary backdrop-blur-sm">
                  <Sparkles className="mr-2 h-4 w-4 inline" />
                  See It In Action
                </Badge>
              </Floating>

              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                Gateway Insights Demo
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Watch how Gateway Insights transforms Solana transaction analytics with real-time monitoring and cost optimization
              </p>
            </div>
          </FadeIn>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Video Player with Tabs - Takes up 3 columns */}
            <ScaleIn delay={0.2} className="lg:col-span-3">
              <Tabs defaultValue="demo" className="w-full">
                {/* Tabs List */}
                <TabsList className="grid w-full grid-cols-2 mb-6 h-auto p-1 bg-muted/50 backdrop-blur-sm">
                  {videos.map((video) => (
                    <TabsTrigger
                      key={video.id}
                      value={video.id}
                      className="flex items-center gap-2 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30"
                    >
                      <Video className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-semibold">{video.title}</div>
                        <div className="text-xs opacity-70">{video.duration}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Video Content */}
                {videos.map((video) => (
                  <TabsContent key={video.id} value={video.id} className="mt-0">
                    <Card className="relative overflow-hidden group border-primary/20 shadow-2xl">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                      <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-background relative">
                        {playingVideo !== video.id ? (
                          /* Video Thumbnail/Placeholder */
                          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-gradient-to-br from-background/90 via-background/80 to-background/90">
                            <div className="text-center space-y-8 p-8">
                              {/* Animated Play Button */}
                              <div className="relative inline-block">
                                {/* Ripple Rings */}
                                {[...Array(3)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute inset-0 rounded-full border-2 border-primary animate-ping"
                                    style={{
                                      animationDelay: `${i * 0.3}s`,
                                      animationDuration: '2s',
                                    }}
                                  />
                                ))}

                                {/* Play Button */}
                                <button
                                  onClick={() => setPlayingVideo(video.id)}
                                  className="relative group/play"
                                  aria-label={`Play ${video.title}`}
                                >
                                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/50 transition-all duration-300 group-hover/play:scale-110 group-hover/play:shadow-primary/70">
                                    <Play className="h-12 w-12 text-primary-foreground ml-2" fill="currentColor" />
                                  </div>
                                </button>
                              </div>

                              {/* Video Info */}
                              <div className="space-y-3">
                                <h3 className="text-2xl md:text-3xl font-bold">
                                  {video.title}
                                </h3>
                                <p className="text-muted-foreground text-lg">
                                  {video.description}
                                </p>
                              </div>

                              {/* Stats Pills */}
                              <div className="flex flex-wrap justify-center gap-4">
                                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                                  <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold">{video.duration} Duration</span>
                                  </div>
                                </div>
                                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold">1080p HD</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Actual Video Embed */
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`${video.url}?autoplay=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>

                      {/* What You'll See Section */}
                      <div className="p-6 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm">
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          What You'll See
                        </h4>
                        <StaggerContainer className="grid md:grid-cols-2 gap-3">
                          {video.highlights.map((feature, index) => (
                            <StaggerItem key={index}>
                              <div className="flex items-start gap-3 group/item">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-primary/30 group-hover/item:scale-110 transition-transform">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                                  {feature}
                                </span>
                              </div>
                            </StaggerItem>
                          ))}
                        </StaggerContainer>
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </ScaleIn>

            {/* Key Highlights Sidebar - Takes up 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <FadeIn delay={0.3}>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Key Highlights
                </h3>
              </FadeIn>

              <StaggerContainer staggerDelay={0.15} className="space-y-4">
                {highlights.map((highlight, index) => (
                  <StaggerItem key={index}>
                    <ScaleIn delay={0.4 + index * 0.1}>
                      <Card className={`group relative overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer`}>
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                        <div className="relative p-6">
                          <div className="flex items-start gap-4">
                            {/* Animated Icon */}
                            <Floating yOffset={3} duration={2} delay={index * 0.2}>
                              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <highlight.icon className={`h-7 w-7 ${highlight.iconColor}`} />
                              </div>
                            </Floating>

                            <div className="space-y-2 flex-1">
                              <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {highlight.title}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {highlight.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Hover Indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </Card>
                    </ScaleIn>
                  </StaggerItem>
                ))}

                {/* CTA Card */}
                <StaggerItem>
                  <ScaleIn delay={0.7}>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-2xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                      </div>

                      <div className="relative p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary animate-pulse" />
                          <h4 className="font-semibold text-lg">Ready to Try It?</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Explore the live dashboard and see real Solana transactions tracked in real-time.
                        </p>
                        <Button asChild className="w-full group/btn shadow-lg shadow-primary/20 hover:shadow-primary/30">
                          <a href="/dashboard">
                            <Zap className="mr-2 h-4 w-4 group-hover/btn:animate-pulse" />
                            Launch Dashboard
                          </a>
                        </Button>
                      </div>
                    </Card>
                  </ScaleIn>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
