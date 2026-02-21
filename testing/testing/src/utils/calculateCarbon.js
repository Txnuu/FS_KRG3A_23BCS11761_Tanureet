export function calculateCarbon(distance, factor) {
  if (distance < 0 || factor < 0) return 0;
  return distance * factor;
}