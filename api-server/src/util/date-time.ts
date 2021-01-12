/* eslint-disable import/prefer-default-export */
import ms from 'ms';

export const getUrlExpireDate = (offset: string): Date =>
  new Date(new Date().getTime() + ms(offset));
