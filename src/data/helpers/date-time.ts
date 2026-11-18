import { TZDate, tz } from "@date-fns/tz";
import { format, isValid, parseISO } from "date-fns";

export const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

const inBusinessZone = { in: tz(BUSINESS_TIME_ZONE) };
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const INSTANT_WITH_OFFSET =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  timeZone: BUSINESS_TIME_ZONE,
});

export interface BusinessRange {
  startDate: Date;
  endDate: Date;
}

export const isDateOnly = (value: unknown): value is string =>
  typeof value === "string" &&
  DATE_ONLY.test(value) &&
  isValid(parseISO(value));

export const parseInstant = (value: unknown): Date | null => {
  if (typeof value !== "string" || !INSTANT_WITH_OFFSET.test(value))
    return null;
  const date = new Date(value);
  return isValid(date) ? date : null;
};

export const parseDateOnly = (value: unknown): Date | null =>
  isDateOnly(value) ? new Date(`${value}T00:00:00.000Z`) : null;

const businessMidnight = (dateOnly: string, plusDays = 0): Date => {
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(
    new TZDate(year, month - 1, day + plusDays, BUSINESS_TIME_ZONE).getTime(),
  );
};

export const businessDayKey = (date: Date): string =>
  format(date, "yyyy-MM-dd", inBusinessZone);

export const businessWeekdayLabel = (date: Date): string =>
  weekdayFormatter.format(date).replace(".", "");

export const shiftDateOnly = (dateOnly: string, days: number): string =>
  businessDayKey(businessMidnight(dateOnly, days));

export const businessDayRange = (
  startDateOnly: string,
  endDateOnly: string,
): BusinessRange => ({
  startDate: businessMidnight(startDateOnly),
  endDate: businessMidnight(endDateOnly, 1),
});

export const defaultBusinessRange = (
  days: number,
  now: Date = new Date(),
): BusinessRange => {
  const today = businessDayKey(now);
  return businessDayRange(shiftDateOnly(today, -(days - 1)), today);
};

const isUtcMidnight = (date: Date): boolean =>
  date.getUTCHours() === 0 &&
  date.getUTCMinutes() === 0 &&
  date.getUTCSeconds() === 0 &&
  date.getUTCMilliseconds() === 0;

export const parseCivilDate = (value: unknown): Date | null => {
  if (isDateOnly(value)) return parseDateOnly(value);
  const instant = parseInstant(value);
  if (!instant) return null;
  return isUtcMidnight(instant) ? instant : parseDateOnly(businessDayKey(instant));
};

export const parseBusinessPeriodStart = (value: unknown): Date | undefined =>
  isDateOnly(value) ? businessMidnight(value) : parseInstant(value) ?? undefined;

export const parseBusinessPeriodEnd = (value: unknown): Date | undefined =>
  isDateOnly(value) ? businessMidnight(value, 1) : parseInstant(value) ?? undefined;
