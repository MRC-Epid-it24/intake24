/* eslint-disable import/prefer-default-export */
import { format as dateFnsFormat } from 'date-fns';

export const formatDate = (date: Date | string, format = 'dd/MM/yyyy HH:mm:ss'): string => {
  const dt = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dt, format);
};
