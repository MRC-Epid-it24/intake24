import type { PortionSizeStates } from '@intake24/common/types';
import type { SurveySubmissionPortionSizeFieldCreationAttributes } from '@intake24/common/types/models';

export const genericMapper = <T extends keyof PortionSizeStates>(
  foodId: string,
  state: PortionSizeStates[T]
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { method, ...rest } = state;

  return Object.entries(rest).map(([name, value]) => ({
    foodId,
    name,
    value: value?.toString() ?? '',
  }));
};

export const asServedMapper = (
  foodId: string,
  state: PortionSizeStates['as-served']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { leftoversWeight, servingWeight, serving, leftovers } = state;

  return [
    { foodId, name: 'leftovers', value: (!!leftovers).toString() },
    { foodId, name: 'leftoversImage', value: leftovers?.imageUrl ?? '' },
    { foodId, name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversChoiceIndex', value: leftovers?.index?.toString() ?? '' },
    { foodId, name: 'servingImage', value: serving?.imageUrl ?? '' },
    { foodId, name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'servingChoiceIndex', value: serving?.index?.toString() ?? '' },
  ];
};

export const cerealMapper = (
  foodId: string,
  state: PortionSizeStates['cereal']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    type,
    bowl,
    bowlId,
    bowlIndex,
    imageUrl,
    leftoversWeight,
    servingWeight,
    serving,
    leftovers,
  } = state;

  return [
    { foodId, name: 'bowl', value: bowl ?? '' },
    { foodId, name: 'bowlId', value: bowlId?.toString() ?? '' },
    { foodId, name: 'bowlIndex', value: bowlIndex?.toString() ?? '' },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'leftovers', value: (!!leftovers).toString() },
    { foodId, name: 'leftoversImage', value: leftovers?.imageUrl ?? '' },
    { foodId, name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversChoiceIndex', value: leftovers?.index?.toString() ?? '' },
    { foodId, name: 'servingImage', value: serving?.imageUrl ?? '' },
    { foodId, name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'servingChoiceIndex', value: serving?.index?.toString() ?? '' },
    { foodId, name: 'type', value: type },
  ];
};

export const drinkScaleMapper = (
  foodId: string,
  state: PortionSizeStates['drink-scale']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    containerId,
    containerIndex,
    drinkwareId,
    fillLevel,
    imageUrl,
    initialFillLevel,
    leftovers,
    leftoversWeight,
    leftoversLevel,
    servingWeight,
    skipFillLevel,
  } = state;

  return [
    { foodId, name: 'containerId', value: containerId ?? '' },
    { foodId, name: 'containerIndex', value: containerIndex?.toString() ?? '' },
    { foodId, name: 'drinkware-id', value: drinkwareId },
    { foodId, name: 'fillLevel', value: fillLevel.toString() },
    { foodId, name: 'imageUrl', value: imageUrl },
    { foodId, name: 'initial-fill-level', value: initialFillLevel.toString() },
    { foodId, name: 'leftovers', value: leftovers.toString() },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversLevel', value: leftoversLevel.toString() },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'skip-fill-level', value: skipFillLevel.toString() },
  ];
};

export const guideImageMapper = (
  foodId: string,
  state: PortionSizeStates['guide-image']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    guideImageId,
    imageUrl,
    objectId,
    objectIndex,
    objectWeight,
    leftoversWeight,
    quantity,
    servingWeight,
  } = state;

  return [
    { foodId, name: 'guide-image-id', value: guideImageId },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'objectId', value: objectId ?? '' },
    { foodId, name: 'objectIndex', value: objectIndex?.toString() ?? '' },
    { foodId, name: 'objectWeight', value: objectWeight.toString() },
    { foodId, name: 'quantity', value: quantity.toString() },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ];
};

export const milkInAHotDrinkMapper = (
  foodId: string,
  state: PortionSizeStates['milk-in-a-hot-drink']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { leftoversWeight, servingWeight, milkPartIndex, milkVolumePercentage } = state;

  return [
    { foodId, name: 'milkPartIndex', value: milkPartIndex?.toString() ?? '' },
    { foodId, name: 'milkVolumePercentage', value: milkVolumePercentage?.toString() ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ];
};

export const milkOnCerealMapper = (
  foodId: string,
  state: PortionSizeStates['milk-on-cereal']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    bowl,
    bowlId,
    bowlIndex,
    imageUrl,
    milkLevelId,
    milkLevelIndex,
    milkLevelImage,
    leftoversWeight,
    servingWeight,
  } = state;

  return [
    { foodId, name: 'bowl', value: bowl ?? '' },
    { foodId, name: 'bowlId', value: bowlId ?? '' },
    { foodId, name: 'bowlIndex', value: bowlIndex?.toString() ?? '' },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'milkLevelId', value: milkLevelId ?? '' },
    { foodId, name: 'milkLevelChoice', value: milkLevelIndex?.toString() ?? '' },
    { foodId, name: 'milkLevelImage', value: milkLevelImage ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ];
};

export const pizzaPortionMapper = (
  foodId: string,
  state: PortionSizeStates['pizza']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { type, thickness, slice, leftoversWeight, servingWeight } = state;

  return [
    { foodId, name: 'typeId', value: type.id ?? '' },
    { foodId, name: 'typeIndex', value: type.index?.toString() ?? '' },
    { foodId, name: 'typeImage', value: type.image ?? '' },
    { foodId, name: 'thicknessId', value: thickness.id ?? '' },
    { foodId, name: 'thicknessIndex', value: thickness.index?.toString() ?? '' },
    { foodId, name: 'thicknessImage', value: type.image ?? '' },
    { foodId, name: 'sliceId', value: slice.id ?? '' },
    { foodId, name: 'sliceIndex', value: slice.index?.toString() ?? '' },
    { foodId, name: 'sliceImage', value: slice.image ?? '' },
    { foodId, name: 'sliceQuantity', value: slice.quantity?.toString() ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ];
};

export const standardPortionMapper = (
  foodId: string,
  state: PortionSizeStates['standard-portion']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { quantity, unit, leftoversWeight, servingWeight } = state;

  return [
    { foodId, name: 'quantity', value: quantity.toString() },
    { foodId, name: 'unitName', value: unit?.name ?? '' },
    { foodId, name: 'unitWeight', value: unit?.weight.toString() ?? '' },
    { foodId, name: 'unitOmitFoodDescription', value: unit?.omitFoodDescription.toString() ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ];
};

export const portionSizeMappers: Record<
  keyof PortionSizeStates,
  (...arg: any[]) => SurveySubmissionPortionSizeFieldCreationAttributes[]
> = {
  'as-served': asServedMapper,
  cereal: cerealMapper,
  'drink-scale': drinkScaleMapper,
  'guide-image': guideImageMapper,
  'milk-in-a-hot-drink': milkInAHotDrinkMapper,
  'milk-on-cereal': milkOnCerealMapper,
  pizza: pizzaPortionMapper,
  'standard-portion': standardPortionMapper,
  weight: genericMapper,
};

export type PortionSizeMappers = typeof portionSizeMappers;
