import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Toaster } from "sonner";
import { inter, instrumentSans } from "@/lib/fonts";
import { PitchDeckFAB } from "@/components/ui/pitch-deck-fab";
import { HomeFAB } from "@/components/ui/home-fab";

export const metadata: Metadata = {
  title: "Gateway Insights - Sanctum Transaction Analytics",
  description: "Production-grade transaction analytics platform for Solana developers. Real-time tracking, cost analysis, and Gateway integration insights.",
  keywords: ["Solana", "Gateway", "Sanctum", "Transaction Analytics", "Blockchain"],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${instrumentSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalLayout>{children}</ConditionalLayout>
          <PitchDeckFAB />
          <HomeFAB />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
