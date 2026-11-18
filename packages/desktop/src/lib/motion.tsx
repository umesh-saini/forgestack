import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * Read the active theme's accent color from the CSS variable `--accent`.
 * Falls back to the dark-theme accent (#fb5c0b) if the variable is unset.
 * Used to color the Three.js figures so they stay correct across all themes.
 */
export function useThemeAccent(): string {
  const [accent, setAccent] = React.useState<string>('#fb5c0b');
  React.useEffect(() => {
    const read = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim();
      if (v) setAccent(v);
    };
    read();
    // Re-read when the theme class on <html> changes.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return accent;
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Horizontal travel distance for the reveal, in px. 0 = vertical only. */
  x?: number;
  once?: boolean;
}

/**
 * Scroll-into-view reveal. Honors prefers-reduced-motion (renders the children
 * statically with no transform) so motion never blocks readability.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  x = 0,
  once = true,
}) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  const variants: Variants = {
    hidden: { opacity: 0, y: 28, x, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
};

/** Variants for staggering children inside a <Reveal> container. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export { revealVariants };
