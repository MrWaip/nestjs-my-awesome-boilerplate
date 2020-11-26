import { image } from 'faker';

export const parseEnvInt = (s: unknown, defaultResult: number, ...options: any[]): number => {
  if (!s) return defaultResult;
  if (typeof s !== 'string') return defaultResult;
  return parseInt(s, ...options);
};
