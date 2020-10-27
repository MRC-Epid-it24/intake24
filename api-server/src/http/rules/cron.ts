import { isValidCron } from 'cron-validator';

export default (value: string): boolean => isValidCron(value, { seconds: true });
