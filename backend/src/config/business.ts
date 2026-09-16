/**
 * Opening hours of the barbershop, expressed in the shop timezone.
 * Times are "HH:mm" and weekdays follow Date#getDay (0 = Sunday).
 */
export const businessHours = {
  timeZone: process.env.BUSINESS_TIMEZONE ?? 'America/Sao_Paulo',
  openingTime: process.env.BUSINESS_OPENING_TIME ?? '09:00',
  closingTime: process.env.BUSINESS_CLOSING_TIME ?? '19:00',
  slotIntervalMinutes: Number(process.env.BUSINESS_SLOT_INTERVAL ?? 30),
  workingWeekDays: (process.env.BUSINESS_WORKING_DAYS ?? '1,2,3,4,5,6')
    .split(',')
    .map((day) => Number(day.trim())),
};

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export const openingMinutes = timeToMinutes(businessHours.openingTime);
export const closingMinutes = timeToMinutes(businessHours.closingTime);
