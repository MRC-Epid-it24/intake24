export function toCacheKey(localeId: string, foodCode: string): string {
  return `${localeId}.${foodCode}`;
}

export function toFoodCode(localeId: string, cacheKey: string): string {
  return cacheKey.substring(localeId.length + 1);
}
