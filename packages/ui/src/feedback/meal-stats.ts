import type {
  FeedbackMealChart,
  FeedbackMeals,
  FeedbackMealTable,
} from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';
import { getLocaleContent, getNutrientGroupUnit } from '@intake24/ui/util';

import type { NutrientGroupChartData } from './charts';
import type { MealStats } from './classes';

export interface FeedbackMealChartData extends FeedbackMealChart {
  chartData: NutrientGroupChartData[];
}

export type MealTableFieldData = Record<string, string | number | null>;

export interface FeedbackMealTableData extends FeedbackMealTable {
  tableData: MealTableFieldData[];
}

export interface FeedbackMealsData extends Omit<FeedbackMeals, 'chart' | 'table'> {
  chart: FeedbackMealChartData;
  table: FeedbackMealTableData;
}

export const buildMealStats = (
  feedbackMeals: FeedbackMeals,
  meals: MealStats[],
  nutrientTypes: NutrientType[] = []
): FeedbackMealsData => {
  const { chart, table } = feedbackMeals;

  const chartData = chart.nutrientGroups.map((nutrientGroup) => {
    const { id } = nutrientGroup;

    const name = getLocaleContent(nutrientGroup.name);
    const unit = getNutrientGroupUnit(id, nutrientTypes);

    const data = meals.map((meal) => ({
      name: meal.name,
      value: meal.stats.getGroupAverageIntake(id),
    }));

    return { id, name, unit, data };
  });

  const tableData = meals.map((meal) => {
    return table.fields.reduce<MealTableFieldData>((acc, field) => {
      let value: string | number | null = null;
      const item = getLocaleContent(field.item);

      switch (field.type) {
        case 'standard':
          value = meal[field.fieldId];
          break;
        case 'custom':
          value = meal.customFields.find((item) => item.name === field.fieldId)?.value ?? null;
          break;
        case 'nutrientGroup':
          value = meal.stats.getGroupAverageIntake(field.nutrientTypes);
          break;
      }

      acc[field.fieldId] = item && value ? item.replace('{value}', value.toString()) : value;

      return acc;
    }, {});
  });

  return { chart: { ...chart, chartData }, table: { ...table, tableData } };
};
