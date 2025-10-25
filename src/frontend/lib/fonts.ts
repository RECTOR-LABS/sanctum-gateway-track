import { Inter, Instrument_Sans } from 'next/font/google';

/**
 * Inter - Fallback font for body text
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Instrument Sans - Sanctum Gateway brand font
 * Used throughout the app to match Sanctum's branding
 */
export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});
