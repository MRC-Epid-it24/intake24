import type { LocaleTranslation } from '@intake24/common/types';

export type ChartData = {
  name: string;
  value: number;
};

export type NutrientChartData = {
  id: string[];
  name: LocaleTranslation;
  unit: string;
  data: ChartData[];
};
