/* eslint-disable import/prefer-default-export */
import { DemographicGroup } from '@intake24/common/feedback';

export const demographicGroupDefaults: DemographicGroup = {
  id: 'demographic-group',
  type: 'demographic-group',
  age: null,
  height: null,
  weight: null,
  nutrientRuleType: 'energy_divided_by_bmr',
  nutrientTypeId: '1',
  physicalActivityLevelId: '1',
  sex: null,
  scaleSectors: [
    {
      name: { en: 'Energy' },
      description: { en: null },
      range: { start: 0, end: 10 },
      sentiment: 'good',
    },
  ],
};
