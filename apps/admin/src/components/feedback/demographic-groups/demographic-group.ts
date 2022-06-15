import type { DemographicGroup, DemographicGroupScaleSector } from '@intake24/common/feedback';
import { copy, randomString } from '@intake24/common/util';

export const demographicGroupScaleSectorDefaults: DemographicGroupScaleSector = {
  name: { en: 'Energy' },
  description: { en: null },
  range: { start: 0, end: 10 },
  sentiment: 'good',
};

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
  scaleSectors: [{ ...demographicGroupScaleSectorDefaults }],
};

export const getDemographicGroupDefaults = (): DemographicGroup =>
  copy({ ...demographicGroupDefaults, id: randomString(6) });
