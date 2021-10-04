import ms from 'ms';

/**
 * Add time
 *
 * @param {(string | number)} offset time in `ms` format or milliseconds
 * @param {Date} [since=new Date()]
 * @returns {Date}
 */
export const addTime = (offset: string | number, since: Date = new Date()): Date =>
  new Date(since.getTime() + (typeof offset === 'string' ? ms(offset) : offset));

/**
 * Subtract time
 *
 * @param {(string | number)} offset time in `ms` format or milliseconds
 * @param {Date} [since=new Date()]
 * @returns {Date}
 */
export const subtractTime = (offset: string | number, since: Date = new Date()): Date =>
  new Date(since.getTime() - (typeof offset === 'string' ? ms(offset) : offset));

/**
 * Simple sleep/wait async helper
 *
 * @param {number} timeout
 * @returns {Promise<void>}
 */
export const sleep = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout));
