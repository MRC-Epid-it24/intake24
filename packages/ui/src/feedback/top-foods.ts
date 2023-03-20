import type { TopFoods } from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';
import { round } from '@intake24/common/util';

import { AggregateFoodStats } from './classes';

export type ChartData = {
  name: string;
  value: number;
};

export type TopFoodNutrient = {
  id: string[];
  name: string;
  unit: string;
  data: ChartData[];
  total: number;
};

export interface TopFoodData extends TopFoods {
  nutrients: TopFoodNutrient[];
}

export const filterAndSortFoodByNutrientTypeId = (
  nutrientTypeId: string[],
  foods: AggregateFoodStats[]
): AggregateFoodStats[] =>
  foods
    .map((food) => food.clone())
    .filter((f) => f.getGroupAverageIntake(nutrientTypeId) > 0)
    .sort(
      (a, b) => b.getGroupAverageIntake(nutrientTypeId) - a.getGroupAverageIntake(nutrientTypeId)
    );

export const summarizeOtherFood = (
  nutrientTypeId: string[],
  foods: AggregateFoodStats[]
): AggregateFoodStats[] => {
  if (!foods.length) return [];

  const nutrients = new Map<string, number>();
  nutrientTypeId.forEach((id) => {
    nutrients.set(
      id,
      foods.map((f) => f.getAverageIntake(id)).reduce((a, b) => a + b)
    );
  });

  return [new AggregateFoodStats('Other food', nutrients)];
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
    const { id } = nutrientType;
    const name = nutrientType.name[locale] ?? nutrientType.name.en;

    const nt = nutrientTypes.filter((item) => id.includes(item.id));
    if (nt.length !== nutrientType.id.length)
      throw new Error(`Invalid nutrient types (${nutrientType.id}) defined in feedback top foods.`);

    if (nt.some((item) => item.unit !== nt[0].unit))
      throw new Error('All nutrient types must have the same unit.');

    const { unit } = nt[0];

    const foodHighInNutrient = filterAndSortFoodByNutrientTypeId(id, foods);
    const other = foodHighInNutrient.slice(max);

    const list = foodHighInNutrient.slice(0, max).concat(summarizeOtherFood(id, other));

    const data = list.map((food) => ({
      name: food.name,
      value: food.getGroupAverageIntake(id),
    }));

    const total = foods.map((f) => f.getGroupAverageIntake(id)).reduce((a, b) => a + b, 0);

    return { id, name, unit, data, total: round(total) };
  });

  return { ...topFoods, nutrients };
};
