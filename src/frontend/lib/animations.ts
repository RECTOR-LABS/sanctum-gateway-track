/**
 * Animation utilities for smooth UI transitions
 * Uses Tailwind CSS classes for consistent animations
 */

/**
 * Fade in animation class
 */
export const fadeIn = 'animate-in fade-in duration-300';

/**
 * Fade out animation class
 */
export const fadeOut = 'animate-out fade-out duration-200';

/**
 * Slide in from bottom animation class
 */
export const slideInFromBottom = 'animate-in slide-in-from-bottom-4 duration-300';

/**
 * Slide in from top animation class
 */
export const slideInFromTop = 'animate-in slide-in-from-top-4 duration-300';

/**
 * Slide in from left animation class
 */
export const slideInFromLeft = 'animate-in slide-in-from-left-4 duration-300';

/**
 * Slide in from right animation class
 */
export const slideInFromRight = 'animate-in slide-in-from-right-4 duration-300';

/**
 * Scale in animation class
 */
export const scaleIn = 'animate-in zoom-in-95 duration-200';

/**
 * Scale out animation class
 */
export const scaleOut = 'animate-out zoom-out-95 duration-100';

/**
 * Smooth transition for all properties
 */
export const smoothTransition = 'transition-all duration-200 ease-in-out';

/**
 * Smooth color transition
 */
export const smoothColorTransition = 'transition-colors duration-200 ease-in-out';

/**
 * Hover scale effect
 */
export const hoverScale = 'hover:scale-105 transition-transform duration-200';

/**
 * Hover lift effect (slight upward movement)
 */
export const hoverLift = 'hover:-translate-y-1 transition-transform duration-200';

/**
 * Pulse animation for loading indicators
 */
export const pulse = 'animate-pulse';

/**
 * Spin animation for loading spinners
 */
export const spin = 'animate-spin';

/**
 * Bounce animation
 */
export const bounce = 'animate-bounce';

/**
 * Stagger animation delays for list items
 */
export const staggerDelay = (index: number, baseDelay: number = 50): string => {
  return `delay-${Math.min(index * baseDelay, 500)}`;
};

/**
 * Create a staggered fade-in animation for list items
 */
export const staggeredFadeIn = (index: number): string => {
  return `${fadeIn} ${staggerDelay(index)}`;
};

/**
 * Smooth height transition for collapsible elements
 */
export const smoothHeight = 'transition-[height] duration-300 ease-in-out overflow-hidden';

/**
 * Smooth max-height transition for collapsible elements
 */
export const smoothMaxHeight = 'transition-[max-height] duration-300 ease-in-out overflow-hidden';

/**
 * Card hover effect - subtle lift and shadow
 */
export const cardHoverEffect = `
  ${smoothTransition}
  ${hoverLift}
  hover:shadow-lg
  cursor-pointer
`.trim();

/**
 * Button press effect
 */
export const buttonPressEffect = 'active:scale-95 transition-transform duration-100';

/**
 * Shimmer effect for loading skeletons
 */
export const shimmer = `
  relative
  overflow-hidden
  before:absolute
  before:inset-0
  before:-translate-x-full
  before:animate-[shimmer_2s_infinite]
  before:bg-gradient-to-r
  before:from-transparent
  before:via-white/10
  before:to-transparent
`.trim();

/**
 * Fade in and slide up combination
 */
export const fadeInSlideUp = `${fadeIn} ${slideInFromBottom}`;

/**
 * Smooth opacity transition
 */
export const smoothOpacity = 'transition-opacity duration-300 ease-in-out';
