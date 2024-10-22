import type { NutrientChartData } from './charts';
import type { MealStats } from './classes';
import type {
  FeedbackMealChart,
  FeedbackMeals,
  FeedbackMealTable,
} from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';

import { useI18n } from '@intake24/i18n';
import { getNutrientUnit } from '@intake24/ui';

export interface FeedbackMealChartData extends FeedbackMealChart {
  chartData: NutrientChartData[];
}

export type MealTableFieldData = Record<string, string | number | null>;

export interface FeedbackMealTableData extends FeedbackMealTable {
  tableData: MealTableFieldData[];
}

export interface FeedbackMealsData extends Omit<FeedbackMeals, 'chart' | 'table'> {
  chart: FeedbackMealChartData;
  table: FeedbackMealTableData;
}

export function buildMealStats(feedbackMeals: FeedbackMeals, meals: MealStats[], nutrientTypes: NutrientType[] = []): FeedbackMealsData {
  // TODO: this should not be here
  const { translate } = useI18n();
  const { chart, table } = feedbackMeals;

  const chartData = chart.nutrients.map((nutrient) => {
    const { id, name } = nutrient;

    const unit = getNutrientUnit(id, nutrientTypes);

    const data = meals.map(meal => ({
      name: meal.name,
      value: meal.stats.getGroupAverageIntake(id),
    }));

    return { id, name, unit, data };
  });

  const tableData = meals.map((meal) => {
    return table.fields.reduce<MealTableFieldData>((acc, field) => {
      let resolvedValue: string | number | null = null;
      const value = translate(field.value);

      switch (field.type) {
        case 'standard':
          resolvedValue = meal[field.fieldId];
          break;
        case 'custom':
          resolvedValue
            = meal.customFields.find(item => item.name === field.fieldId)?.value ?? null;
          break;
        case 'nutrient':
          resolvedValue = meal.stats.getGroupAverageIntake(field.types);
          break;
      }

      acc[field.fieldId]
        = value && resolvedValue ? value.replace('{value}', resolvedValue.toString()) : resolvedValue;

      return acc;
    }, {});
  });

  return { chart: { ...chart, chartData }, table: { ...table, tableData } };
}
