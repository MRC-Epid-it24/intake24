/* eslint-disable import/prefer-default-export */
export const round = (value: number, points = 1) => {
  const exp = 10 ** points;
  return Math.round(value * exp) / exp;
};
