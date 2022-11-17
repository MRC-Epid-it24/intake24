import { randomString } from '@intake24/common/util';

export const toIndexedList = <T extends object>(items: T[]): (T & { id: number })[] =>
  items.map((item, idx) => ({ ...item, id: idx }));

export const withIdList = <T extends object>(items: T[]): (T & { id: string })[] =>
  items.map((item) => ({ ...item, id: randomString(6) }));
