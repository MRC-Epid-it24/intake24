export default (value: any): any => {
  if (typeof value === 'string') {
    const chars = value.trim();
    return chars.length ? chars : null;
  }
  return value;
};
