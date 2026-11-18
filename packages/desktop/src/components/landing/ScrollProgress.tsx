import React from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Thin gradient progress bar pinned to the top of the viewport that fills as
 * the page scrolls. Disabled entirely under prefers-reduced-motion.
 */
export const ScrollProgress: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 shadow-[0_0_12px_rgba(251,92,11,0.6)]"
    />
  );
};
