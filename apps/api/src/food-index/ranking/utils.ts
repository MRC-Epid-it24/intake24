export function toCacheKey(localeId: string, foodCode: string): string {
  return `${localeId}.${foodCode}`;
}

export function toFoodCode(localeId: string, cacheKey: string): string {
  return cacheKey.substring(localeId.length + 1);
}

export function mapKeys<T>(
  obj: { [k: string]: T },
  fn: (value: string) => string
): { [k: string]: T } {
  const entries = Object.entries(obj);
  return Object.fromEntries(entries.map((entry) => [fn(entry[0]), entry[1]]));
}
