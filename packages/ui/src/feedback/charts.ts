export type ChartData = {
  name: string;
  value: number;
};

export type NutrientChartData = {
  id: string[];
  name: string;
  unit: string;
  data: ChartData[];
};
