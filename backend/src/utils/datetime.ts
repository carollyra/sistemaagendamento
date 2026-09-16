import { businessHours } from '../config/business.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function timeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const values: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = Number(part.value);
    }
  }

  const asUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour % 24,
    values.minute,
    values.second,
  );

  return asUtc - date.getTime();
}

/** Converts a wall-clock date/time of the shop timezone into a UTC Date. */
export function zonedTimeToUtc(
  date: string,
  minutesFromMidnight: number,
  timeZone = businessHours.timeZone,
): Date {
  const [year, month, day] = date.split('-').map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, 0, minutesFromMidnight);

  const firstOffset = timeZoneOffsetMs(new Date(utcGuess), timeZone);
  const firstPass = utcGuess - firstOffset;
  const secondOffset = timeZoneOffsetMs(new Date(firstPass), timeZone);

  return new Date(utcGuess - secondOffset);
}

/** Returns the "YYYY-MM-DD" and weekday of an instant in the shop timezone. */
export function toZonedParts(date: Date, timeZone = businessHours.timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute),
    weekDay: weekDays.indexOf(parts.weekday),
  };
}

export function isValidDateString(value: string): boolean {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}
