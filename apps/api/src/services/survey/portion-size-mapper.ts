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

  const leftoversChoiceIndex =
    leftovers?.index !== undefined ? (leftovers.index + 1).toString() : '';
  const servingChoiceIndex = serving?.index !== undefined ? (serving.index + 1).toString() : '';

  return [
    { foodId, name: 'leftovers', value: (!!leftovers).toString() },
    { foodId, name: 'leftoversImage', value: leftovers?.imageUrl ?? '' },
    { foodId, name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversChoiceIndex', value: leftoversChoiceIndex },
    { foodId, name: 'servingImage', value: serving?.imageUrl ?? '' },
    { foodId, name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'servingChoiceIndex', value: servingChoiceIndex },
  ];
};

export const cerealMapper = (
  foodId: string,
  state: PortionSizeStates['cereal']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { type, bowl, bowlIndex, imageUrl, leftoversWeight, servingWeight, serving, leftovers } =
    state;

  const bowlIndexValue = bowlIndex !== undefined ? (bowlIndex + 1).toString() : '';

  const leftoversChoiceIndex =
    leftovers?.index !== undefined ? (leftovers.index + 1).toString() : '';
  const servingChoiceIndex = serving?.index !== undefined ? (serving.index + 1).toString() : '';

  return [
    { foodId, name: 'bowl', value: bowl ?? '' },
    { foodId, name: 'bowlIndex', value: bowlIndexValue },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'leftovers', value: (!!leftovers).toString() },
    { foodId, name: 'leftoversImage', value: leftovers?.imageUrl ?? '' },
    { foodId, name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversChoiceIndex', value: leftoversChoiceIndex },
    { foodId, name: 'servingImage', value: serving?.imageUrl ?? '' },
    { foodId, name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'servingChoiceIndex', value: servingChoiceIndex },
    { foodId, name: 'type', value: type },
  ];
};

export const guideImageMapper = (
  foodId: string,
  state: PortionSizeStates['guide-image']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    guideImageId,
    imageUrl,
    objectIndex,
    objectWeight,
    leftoversWeight,
    quantity,
    servingWeight,
  } = state;

  const objectIndexValue = objectIndex !== undefined ? (objectIndex + 1).toString() : '';

  return [
    { foodId, name: 'guide-image-id', value: guideImageId },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'objectIndex', value: objectIndexValue },
    { foodId, name: 'objectWeight', value: objectWeight.toString() },
    { foodId, name: 'quantity', value: quantity.toString() },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ];
};

export const drinkScaleMapper = (
  foodId: string,
  state: PortionSizeStates['drink-scale']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
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

  const containerIndexValue = containerIndex !== undefined ? (containerIndex + 1).toString() : '';

  return [
    { foodId, name: 'containerIndex', value: containerIndexValue },
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

/* export const milkInAHotDrinkMapper = (
  foodId: string,
  state: PortionSizeStates['milk-in-a-hot-drink']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { leftoversWeight, servingWeight } = state;

  const containerIndexValue = containerIndex !== undefined ? (containerIndex + 1).toString() : '';

  return [
    { foodId, name: 'containerIndex', value: containerIndex.toString() },
    { foodId, name: 'drinkware-id', value: drinkwareId },
    { foodId, name: 'fillLevel', value: fillLevel.toString() },
    { foodId, name: 'imageUrl', value: imageUrl },
    { foodId, name: 'initial-fill-level', value: initialFillLevel },
    { foodId, name: 'leftovers', value: leftovers.toString() },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversLevel', value: leftoversLevel.toString() },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'skip-fill-level', value: skipFillLevel },
  ];
}; */

export const milkOnCerealMapper = (
  foodId: string,
  state: PortionSizeStates['milk-on-cereal']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    bowl,
    bowlIndex,
    imageUrl,
    milkLevelChoice,
    milkLevelImage,
    leftoversWeight,
    servingWeight,
  } = state;

  const bowlIndexValue = bowlIndex !== undefined ? (bowlIndex + 1).toString() : '';
  const milkLevelChoiceValue =
    milkLevelChoice !== undefined ? (milkLevelChoice + 1).toString() : '';

  return [
    { foodId, name: 'bowl', value: bowl ?? '' },
    { foodId, name: 'bowlIndex', value: bowlIndexValue },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'milkLevelChoice', value: milkLevelChoiceValue },
    { foodId, name: 'milkLevelImage', value: milkLevelImage ?? '' },
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
  'milk-in-a-hot-drink': genericMapper,
  'milk-on-cereal': milkOnCerealMapper,
  pizza: genericMapper,
  'standard-portion': genericMapper,
  weight: genericMapper,
};

export type PortionSizeMappers = typeof portionSizeMappers;
