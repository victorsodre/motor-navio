/** Tap = one finger/button, short, almost still. Anything else is an orbit gesture. */
export function isTap(gesture: { dx: number; dy: number; ms: number; pointers: number }) {
  return gesture.pointers === 1 && Math.hypot(gesture.dx, gesture.dy) <= 6 && gesture.ms <= 450;
}
