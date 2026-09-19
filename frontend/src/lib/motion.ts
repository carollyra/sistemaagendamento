import type { Transition, Variants } from 'framer-motion';

/** House spring — everything that moves uses this physics. */
export const spring: Transition = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 };

/** Slightly snappier spring for small controls. */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
  mass: 0.6,
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: spring },
};

/** Wizard steps slide in from the side they came from. */
export const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction >= 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0, transition: spring },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -28 : 28,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  }),
};

/** Cards grow a touch instead of jumping. */
export const cardHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.995 },
  transition: spring,
} as const;

/** Shared layout id for the pill that marks the active option in a group. */
export const ACTIVE_PILL = 'active-pill';
