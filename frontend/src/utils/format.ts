function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const weekDayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

/** "Sex 18/09" — compact enough for the day picker grid. */
function formatShortDay(date: Date): string {
  const weekDay = capitalize(weekDayFormatter.format(date).replace(/\.$/, ''));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${weekDay} ${day}/${month}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate));
}

export function formatTime(isoDate: string): string {
  return timeFormatter.format(new Date(isoDate));
}

/** Builds the next `days` calendar days starting today, in YYYY-MM-DD. */
export function buildDayOptions(days: number): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const today = new Date();

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    options.push({
      value,
      label: offset === 0 ? 'Hoje' : formatShortDay(date),
    });
  }

  return options;
}

/** Current day in the browser timezone, formatted as YYYY-MM-DD. */
export function todayISO(): string {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);

  return capitalize(
    new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(year, month - 1, day)),
  );
}

/** Adds days to a YYYY-MM-DD string, returning the same format. */
export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const shifted = new Date(year, month - 1, day + days);

  return [
    shifted.getFullYear(),
    String(shifted.getMonth() + 1).padStart(2, '0'),
    String(shifted.getDate()).padStart(2, '0'),
  ].join('-');
}

/** Short, human label for a YYYY-MM-DD date: "Hoje", "Amanhã" or "Sex 20/09". */
export function formatDayLabel(date: string): string {
  const today = todayISO();

  if (date === today) {
    return 'Hoje';
  }

  if (date === addDays(today, 1)) {
    return 'Amanhã';
  }

  const [year, month, day] = date.split('-').map(Number);

  return formatShortDay(new Date(year, month - 1, day));
}
