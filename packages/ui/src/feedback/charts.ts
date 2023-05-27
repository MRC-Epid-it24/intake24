export type ChartData = {
  name: string;
  value: number;
};

export type NutrientGroupChartData = {
  id: string[];
  name: string;
  unit: string;
  data: ChartData[];
};
