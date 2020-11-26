import { DateTime } from 'luxon';

export enum DateTimeFormats {
  FULL_DATE_TIME = 'dd.MM.yyyy HH:mm:ss',
  SHORT_DATE_TIME = 'dd.MM.yyyy HH:mm',
  DATE = 'dd.MM.yyyy',
}

export interface DateTimeForamtOptions {
  toTimezone?: string;
}

export const formatDateTime = (
  dt: string | Date | DateTime,
  format: DateTimeFormats = DateTimeFormats.FULL_DATE_TIME,
  options?: DateTimeForamtOptions,
): string => {
  if (dt instanceof Date) dt = DateTime.fromJSDate(dt);
  if (typeof dt === 'string') dt = DateTime.fromISO(dt);

  if (options?.toTimezone) dt = dt.setZone(options.toTimezone);

  return dt.toFormat(format);
};
