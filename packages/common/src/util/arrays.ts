export function arrayToObject<
  T extends object /* Record<PropertyKey, unknown> */,
  K extends keyof T,
>(array: T[], key: K): Record<string, T> {
  return Object.fromEntries(array.map(item => [item[key], item]));
}
