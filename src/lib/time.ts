/** Parses "MM:SS" or "HH:MM:SS" into total seconds. */
export function parseClock(value: string): number {
  const parts = value.split(":").map(Number);
  if (parts.some((p) => Number.isNaN(p))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

/** Formats total seconds as "MM:SS". */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

/** Formats total seconds as "HH:MM:SS". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

/**
 * Deterministic pseudo-random seconds in [0, maxSeconds) derived from a
 * string seed (e.g. a camera code)- gives each camera a different, stable
 * "recording started N ago" starting point without storing it in data.
 */
export function seededSeconds(seed: string, maxSeconds: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % maxSeconds;
}
