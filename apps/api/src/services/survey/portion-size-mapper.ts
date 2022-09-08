import type { PortionSizeStates } from '@intake24/common/types';
import type { SurveySubmissionPortionSizeFieldCreationAttributes } from '@intake24/common/types/models';

export const genericMapper = <T extends keyof PortionSizeStates>(
  foodId: string,
  state: PortionSizeStates[T]
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { method, ...rest } = state;

  return Object.entries(rest).map(([name, value]) => ({ foodId, name, value: value.toString() }));
};

export const asServedMapper = (
  foodId: string,
  state: PortionSizeStates['as-served']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { leftoversWeight, servingWeight, serving, leftovers } = state;

  return [
    // { foodId, name: 'serving-image-set', value: '' },
    // { foodId, name: 'servingImage', value: '' },
    // { foodId, name: 'leftovers-image-set', value: '' },
    // { foodId, name: 'leftoversImage', value: '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'servingChoiceIndex', value: serving?.index?.toString() ?? '0' },
    { foodId, name: 'leftovers', value: (!!leftovers).toString() },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversChoiceIndex', value: leftovers?.index?.toString() ?? '0' },
  ];
};

export const guideImageMapper = (
  foodId: string,
  state: PortionSizeStates['guide-image']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    leftoversWeight,
    servingWeight,
    object,
    quantity: { whole, fraction },
  } = state;

  return [
    // { foodId, name: 'guide-image-id', value: '' },
    // { foodId, name: 'imageUrl', value: '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'objectIndex', value: object?.id?.toString() ?? '0' },
    { foodId, name: 'objectWeight', value: object?.weight?.toString() ?? '0' },
    { foodId, name: 'quantity', value: (whole + fraction).toString() },
  ];
};

export const portionSizeMappers: Record<
  keyof PortionSizeStates,
  (...arg: any[]) => SurveySubmissionPortionSizeFieldCreationAttributes[]
> = {
  'as-served': asServedMapper,
  cereal: genericMapper,
  'drink-scale': genericMapper,
  'guide-image': guideImageMapper,
  'milk-in-a-hot-drink': genericMapper,
  'milk-on-cereal': genericMapper,
  pizza: genericMapper,
  'standard-portion': genericMapper,
  weight: genericMapper,
};

export type PortionSizeMappers = typeof portionSizeMappers;
