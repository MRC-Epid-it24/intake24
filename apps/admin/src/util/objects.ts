export const toIndexedList = <T extends object>(items: T[]): (T & { id: number })[] =>
  items.map((item, idx) => ({ ...item, id: idx }));
