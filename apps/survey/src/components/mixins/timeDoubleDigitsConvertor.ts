export default (time: number): string => {
  const stringTime: string = time.toString();
  return stringTime.length === 1 ? '0'.concat(stringTime) : stringTime;
};
