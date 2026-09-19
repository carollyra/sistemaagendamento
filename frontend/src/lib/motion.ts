import type { Transition, Variants } from 'framer-motion';

export const smooth: Transition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };

/** Container that reveals its children one after the other. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: smooth },
};

/** Slides a wizard step in from the side it came from. */
export const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction >= 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0, transition: smooth },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -32 : 32,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
};

/** Subtle lift used on interactive cards. */
export const cardHover = {
  whileHover: { y: -3 },
  whileTap: { y: -1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
} as const;
