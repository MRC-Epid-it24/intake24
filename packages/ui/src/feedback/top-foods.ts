import type { TopFoods } from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';
import { round } from '@intake24/common/util';
import { AggregateFoodStats } from './classes';

export type ChartData = {
  name: string;
  value: number;
};

export type TopFoodNutrient = {
  id: string;
  name: string;
  unit: string;
  data: ChartData[];
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
  nutrientTypes: NutrientType[] = [],
  locale = 'en'
): TopFoodData => {
  const { max } = topFoods;
  if (!max || !topFoods.nutrientTypes.length) return { ...topFoods, nutrients: [] };

  const nutrients = topFoods.nutrientTypes.map((nutrientType) => {
    const nt = nutrientTypes.find((item) => item.id === nutrientType.id);
    if (!nt)
      throw new Error(`Invalid nutrient type (${nutrientType.id}) defined in feedback top foods.`);

    const { id, unit } = nt;
    const name = nutrientType.name[locale] ?? nutrientType.name.en;

    const foodHighInNutrient = filterAndSortFoodByNutrientTypeId(id, foods);
    const other = foodHighInNutrient.slice(max);

    const list = foodHighInNutrient.slice(0, max).concat(summarizeOtherFood(id, other));

    const data = list.map((food) => ({ name: food.name, value: food.getAverageIntake(id) }));

    const total = foods.map((f) => f.getAverageIntake(id)).reduce((a, b) => a + b, 0);

    return {
      id,
      name,
      unit,
      data,
      total: round(total),
    };
  });

  return { ...topFoods, nutrients };
};
