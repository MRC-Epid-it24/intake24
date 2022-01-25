import { ChartData as ChartJsData } from 'chart.js';
import { NutrientTypeIdEnum } from './character';
import AggregateFoodStats from './aggregate-food-stats';

export const colorMap: [string, string][] = [
  ['ch-red', '#FF6384'],
  ['ch-blue', '#36A2EB'],
  ['ch-yellow', '#FFCE56'],
  ['ch-lilac', '#9c27b0'],
  ['ch-green', '#8bc34a'],
  ['ch-grey', '#999999'],
];

export type ChartData = {
  value: number;
  label: string;
  color: string;
};

export type TopFoodData = {
  nutrientTypeId: string;
  list: AggregateFoodStats[];
  chart: ChartData[];
  chartJs?: ChartJsData;
  total: number;
};

export const filterAndSortFoodByNutrientTypeId = (
  nutrientTypeId: string,
  foods: AggregateFoodStats[]
): AggregateFoodStats[] => {
  return foods
    .map((food) => food.clone())
    .filter((f) => f.getAverageIntake(nutrientTypeId) > 0)
    .sort((a, b) => b.getAverageIntake(nutrientTypeId) - a.getAverageIntake(nutrientTypeId));
};

export const summarizeOtherFood = (
  nutrientTypeId: string,
  foods: AggregateFoodStats[]
): AggregateFoodStats[] => {
  if (!foods.length) return [];

  const total = foods.map((f) => f.getAverageIntake(nutrientTypeId)).reduce((a, b) => a + b);
  return [new AggregateFoodStats('Other food', new Map([[nutrientTypeId, total]]))];
};

export const getTopFoods = (
  nutrients: string[],
  foods: AggregateFoodStats[],
  max = 5
): TopFoodData[] => {
  return nutrients.map((nutrientTypeId) => {
    const foodHighInNutrient = filterAndSortFoodByNutrientTypeId(nutrientTypeId, foods);
    const other = foodHighInNutrient.slice(max);

    const list = foodHighInNutrient.slice(0, max).concat(summarizeOtherFood(nutrientTypeId, other));

    const chart = list.map((food, index) => ({
      value: food.getAverageIntake(nutrientTypeId),
      label: food.name,
      color: colorMap[index][1],
    }));

    const total = foods
      .map((f) =>
        nutrientTypeId === NutrientTypeIdEnum.Energy
          ? f.getAverageEnergyIntake()
          : f.getAverageIntake(nutrientTypeId)
      )
      .reduce((a, b) => a + b, 0);

    return {
      nutrientTypeId,
      list,
      chart,
      total: Math.round(total * 10) / 10,
    };
  });
};
