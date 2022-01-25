/* eslint-disable import/prefer-default-export */
import { NutrientRuleType } from '@intake24/common/feedback';

export class DemographicNutrientRuleTypeDescriptions {
  private static readonly descriptionMap: Map<NutrientRuleType, string> = new Map([
    [
      NutrientRuleType.RANGE,
      'Feedback is based on your consumption of the corresponding nutrient fitting into optimal intake.',
    ],
    [
      NutrientRuleType.ENERGY_DIVIDED_BY_BMR,
      'Feedback is based on your energy intake divided by BMR fitting into optimal intake.',
    ],
    [
      NutrientRuleType.PERCENTAGE_OF_ENERGY,
      'Feedback is based on the contribution of the corresponding nutrient to your energy intake.',
    ],
    [
      NutrientRuleType.PER_UNIT_OF_WEIGHT,
      'Feedback is based on your consumption of the corresponding nutrient per Kg of your weight fitting into optimal intake.',
    ],
  ]);

  static getItem(nutrientRuleType: NutrientRuleType): string | undefined {
    return DemographicNutrientRuleTypeDescriptions.descriptionMap.get(nutrientRuleType);
  }
}
