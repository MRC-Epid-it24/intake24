import type {
  FeedbackMealChart,
  FeedbackMealStats,
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

export interface FeedbackMealStatsData extends Omit<FeedbackMealStats, 'chart' | 'table'> {
  chart: FeedbackMealChartData;
  table: FeedbackMealTableData;
}

export const buildMealStats = (
  feedbackMealStats: FeedbackMealStats,
  meals: MealStats[],
  nutrientTypes: NutrientType[] = []
): FeedbackMealStatsData => {
  const { chart, table } = feedbackMealStats;

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
    }, {});
  });

  return { chart: { ...chart, chartData }, table: { ...table, tableData } };
};
