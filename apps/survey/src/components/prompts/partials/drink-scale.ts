import type { DrinkwareVolumeSampleResponse } from '@intake24/common/types/http';

export const interpolate = (fill: number, sf0: number, sv0: number, sf1: number, sv1: number) => {
  const a = (fill - sf0) / (sf1 - sf0);
  return sv0 + (sv1 - sv0) * a;
};

export const calculateVolume = (volumes: DrinkwareVolumeSampleResponse[], fillLevel: number) => {
  if (fillLevel < 0) return 0;

  let i: number;

  for (i = 0; i < volumes.length; i++) {
    if (volumes[i].fill >= fillLevel) break;
  }

  if (i === 0) return interpolate(fillLevel, 0, 0, volumes[0].fill, volumes[0].volume);

  if (i === volumes.length) return volumes[i - 1].volume;

  return interpolate(
    fillLevel,
    volumes[i - 1].fill,
    volumes[i - 1].volume,
    volumes[i].fill,
    volumes[i].volume
  );
};
