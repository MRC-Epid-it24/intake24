import { randomString } from '@intake24/common/util';

export const toIndexedList = <T extends object>(items: T[]): (T & { id: number })[] =>
  items.map((item, idx) => ({ ...item, id: idx }));

export const withIdList = <T extends object>(items: T[]): (T & { id: string })[] =>
  items.map((item) => ({ ...item, id: randomString(6) }));

export const withInternalId = <T>(
  item: T,
  index: number
): T & { _id: string; orderBy: string } => ({
  ...item,
  _id: randomString(6),
  orderBy: index.toString(),
});

export const withoutInternalId = <T extends { _id: string; orderBy: string }>(
  { _id, ...rest }: T,
  index: number
): Omit<T, '_id'> => ({ ...rest, orderBy: index.toString() });
