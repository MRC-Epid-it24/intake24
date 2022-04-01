import { ChartData as ChartJsData } from 'chart.js';
import { TopFoods } from '@intake24/common/feedback';
import { round } from '@intake24/common/util';
import { AggregateFoodStats } from './classes';

export type ChartData = {
  value: number;
  label: string;
  color: string;
};

export type TopFoodNutrient = {
  id: string;
  name: string;
  list: AggregateFoodStats[];
  chart: ChartData[];
  chartJs: ChartJsData;
  total: number;
};

export interface TopFoodData extends TopFoods {
  nutrients: TopFoodNutrient[];
}

export const filterAndSortFoodByNutrientTypeId = (
  nutrientTypeId: string,
  foods: AggregateFoodStats[]
): AggregateFoodStats[] =>
  foods
    .map((food) => food.clone())
    .filter((f) => f.getAverageIntake(nutrientTypeId) > 0)
    .sort((a, b) => b.getAverageIntake(nutrientTypeId) - a.getAverageIntake(nutrientTypeId));

export const summarizeOtherFood = (
  nutrientTypeId: string,
  foods: AggregateFoodStats[]
): AggregateFoodStats[] => {
  if (!foods.length) return [];

  const total = foods.map((f) => f.getAverageIntake(nutrientTypeId)).reduce((a, b) => a + b);
  return [new AggregateFoodStats('Other food', new Map([[nutrientTypeId, total]]))];
};

export const buildTopFoods = (
  topFoods: TopFoods,
  foods: AggregateFoodStats[],
  locale = 'en'
): TopFoodData => {
  const { max, colors, nutrientTypes } = topFoods;
  if (!max || !nutrientTypes.length) return { ...topFoods, nutrients: [] };

  const nutrients = nutrientTypes.map((nutrientType) => {
    const { id } = nutrientType;
    const name = nutrientType.name[locale] ?? nutrientType.name.en;

    const foodHighInNutrient = filterAndSortFoodByNutrientTypeId(id, foods);
    const other = foodHighInNutrient.slice(max);

    const list = foodHighInNutrient.slice(0, max).concat(summarizeOtherFood(id, other));

    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];

    const chart = list.map((food, index) => {
      const label = food.name;
      const value = food.getAverageIntake(id);
      const color = colors[index];

      labels.push(label);
      data.push(value);
      backgroundColor.push(color);

      return { value, label, color };
    });

    const total = foods.map((f) => f.getAverageIntake(id)).reduce((a, b) => a + b, 0);

    return {
      id,
      name,
      list,
      chart,
      chartJs: { labels, datasets: [{ data, backgroundColor }] },
      total: round(total),
    };
  });

  return { ...topFoods, nutrients };
};
