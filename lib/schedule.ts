export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 18;

export function buildTimeSlots(duration: number): string[] {
  const slots: string[] = [];
  const start = OPEN_HOUR * 60;
  const end = CLOSE_HOUR * 60;
  for (let t = start; t + duration <= end; t += duration) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// True if [aStart, aStart+aDur) overlaps [bStart, bStart+bDur)
export function rangesOverlap(
  aStart: number,
  aDur: number,
  bStart: number,
  bDur: number
): boolean {
  return aStart < bStart + bDur && bStart < aStart + aDur;
}
