export default async (value: any): Promise<any> => {
  if (typeof value === 'string') {
    const chars = value.trim();
    return chars.length ? chars : null;
  }
  return value;
};
