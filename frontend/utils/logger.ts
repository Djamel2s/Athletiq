const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  error: (...args: any[]) => {
    if (isDev) console.error(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
};
