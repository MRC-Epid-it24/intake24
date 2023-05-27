import type {
  FeedbackMealChart,
  FeedbackMealStats,
  FeedbackMealTable,
  MealTableField,
} from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';
import { getNutrientGroupUnit } from '@intake24/ui/util';

import type { NutrientGroupChartData } from './charts';
import type { MealStats } from './classes';

export interface FeedbackMealChartData extends FeedbackMealChart {
  chartData: NutrientGroupChartData[];
}

export type MealTableFieldData = MealTableField & { [key: string]: string };

export interface FeedbackMealTableData extends FeedbackMealTable {
  tableData: MealTableFieldData[];
}

export interface FeedbackMealStatsData extends Omit<FeedbackMealStats, 'chart' | 'table'> {
  chart: FeedbackMealChartData;
  table: FeedbackMealTableData;
}

export const buildMealStats = (
  feedbackMealStats: FeedbackMealStats,
  meals: MealStats[],
  nutrientTypes: NutrientType[] = [],
  locale = 'en'
): FeedbackMealStatsData => {
  const { chart, table } = feedbackMealStats;

  const chartData = chart.nutrientGroups.map((nutrientGroup) => {
    const { id } = nutrientGroup;
    const name = nutrientGroup.name[locale] ?? nutrientGroup.name.en;

    const unit = getNutrientGroupUnit(id, nutrientTypes);

    const data = meals.map((meal) => ({
      name: meal.name,
      value: meal.stats.getGroupAverageIntake(id),
    }));

    return { id, name, unit, data };
  });

  const tableData = meals.map((meal) => {
    return table.fields.reduce<Record<string, any>>((acc, field) => {
      switch (field.type) {
        case 'standard':
          acc[field.fieldId] = meal[field.fieldId];
          break;
        case 'custom':
          acc[field.fieldId] =
            meal.customFields.find((item) => item.name === field.fieldId)?.value ?? null;
          break;
        case 'nutrientGroup':
          acc[field.fieldId] = meal.stats.getGroupAverageIntake(field.nutrientTypes);
          break;
      }

      return acc;
    }, {} as MealTableFieldData);
  });

  return { chart: { ...chart, chartData }, table: { ...table, tableData } };
};
