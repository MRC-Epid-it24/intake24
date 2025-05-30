import { randomUUID } from 'node:crypto';

import type { PortionSizeStates } from '@intake24/common/surveys';
import type { SurveySubmissionPortionSizeFieldCreationAttributes } from '@intake24/db';

function parseUrlPathname(url?: string | null) {
  if (!url)
    return '';

  try {
    return new URL(url).pathname;
  }
  catch {
    return '';
  }
}

export function genericMapper<T extends keyof PortionSizeStates>(foodId: string, state: PortionSizeStates[T]): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { method, ...rest } = state;

  return Object.entries(rest).map(([name, value]) => ({
    id: randomUUID(),
    foodId,
    name,
    value: value?.toString() ?? '',
  }));
}

export function asServedMapper(foodId: string, state: PortionSizeStates['as-served']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { leftoversWeight, servingWeight, serving, leftovers, linkedQuantity, quantity } = state;

  return [
    { name: 'leftovers', value: (!!leftovers).toString() },
    { name: 'leftoversImage', value: parseUrlPathname(leftovers?.imageUrl) },
    { name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'leftoversChoiceIndex', value: leftovers?.index?.toString() ?? '' },
    { name: 'linkedQuantity', value: linkedQuantity.toString() },
    { name: 'servingImage', value: parseUrlPathname(serving?.imageUrl) },
    { name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { name: 'servingChoiceIndex', value: serving?.index?.toString() ?? '' },
    { name: 'quantity', value: quantity.toString() },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function cerealMapper(foodId: string, state: PortionSizeStates['cereal']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
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
    { name: 'bowl', value: bowl ?? '' },
    { name: 'bowlId', value: bowlId?.toString() ?? '' },
    { name: 'bowlIndex', value: bowlIndex?.toString() ?? '' },
    { name: 'imageUrl', value: parseUrlPathname(imageUrl) },
    { name: 'leftovers', value: (!!leftovers).toString() },
    { name: 'leftoversImage', value: parseUrlPathname(leftovers?.imageUrl) },
    { name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'leftoversChoiceIndex', value: leftovers?.index?.toString() ?? '' },
    { name: 'servingImage', value: parseUrlPathname(serving?.imageUrl) },
    { name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { name: 'servingChoiceIndex', value: serving?.index?.toString() ?? '' },
    { name: 'type', value: type },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function directWeightMapper(foodId: string, state: PortionSizeStates['direct-weight']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { leftoversWeight, servingWeight, quantity } = state;

  return [
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { name: 'quantity', value: quantity?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function drinkScaleMapper(foodId: string, state: PortionSizeStates['drink-scale']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
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
    quantity,
  } = state;

  return [
    { name: 'containerId', value: containerId ?? '' },
    { name: 'containerIndex', value: containerIndex?.toString() ?? '' },
    { name: 'quantity', value: quantity.toString() },
    { name: 'drinkware-id', value: drinkwareId },
    { name: 'fillLevel', value: fillLevel.toString() },
    { name: 'imageUrl', value: parseUrlPathname(imageUrl) },
    { name: 'initial-fill-level', value: initialFillLevel.toString() },
    { name: 'leftovers', value: leftovers.toString() },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'leftoversLevel', value: leftoversLevel.toString() },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { name: 'skip-fill-level', value: skipFillLevel.toString() },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function guideImageMapper(foodId: string, state: PortionSizeStates['guide-image']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const {
    guideImageId,
    imageUrl,
    objectId,
    objectIndex,
    objectWeight,
    leftoversWeight,
    linkedQuantity,
    quantity,
    servingWeight,
  } = state;

  return [
    { name: 'guide-image-id', value: guideImageId },
    { name: 'imageUrl', value: parseUrlPathname(imageUrl) },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'linkedQuantity', value: linkedQuantity.toString() },
    { name: 'objectId', value: objectId ?? '' },
    { name: 'objectIndex', value: objectIndex?.toString() ?? '' },
    { name: 'objectWeight', value: objectWeight.toString() },
    { name: 'quantity', value: quantity.toString() },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function milkInAHotDrinkMapper(foodId: string, state: PortionSizeStates['milk-in-a-hot-drink']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { leftoversWeight, servingWeight, milkPartIndex, milkVolumePercentage } = state;

  return [
    { name: 'milkPartIndex', value: milkPartIndex?.toString() ?? '' },
    { name: 'milkVolumePercentage', value: milkVolumePercentage?.toString() ?? '' },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function parentFoodPortionMapper(foodId: string, state: PortionSizeStates['parent-food-portion']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { leftoversWeight, servingWeight, portionIndex, portionValue } = state;

  return [
    { name: 'portionIndex', value: portionIndex?.toString() ?? '' },
    { name: 'portionValue', value: portionValue?.toString() ?? '' },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function milkOnCerealMapper(foodId: string, state: PortionSizeStates['milk-on-cereal']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
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
    { name: 'bowl', value: bowl ?? '' },
    { name: 'bowlId', value: bowlId ?? '' },
    { name: 'bowlIndex', value: bowlIndex?.toString() ?? '' },
    { name: 'imageUrl', value: parseUrlPathname(imageUrl) },
    { name: 'milkLevelId', value: milkLevelId ?? '' },
    { name: 'milkLevelChoice', value: milkLevelIndex?.toString() ?? '' },
    { name: 'milkLevelImage', value: milkLevelImage ?? '' },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function pizzaPortionMapper(foodId: string, state: PortionSizeStates['pizza']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { type, thickness, slice, leftoversWeight, servingWeight } = state;

  return [
    { name: 'typeId', value: type.id ?? '' },
    { name: 'typeIndex', value: type.index?.toString() ?? '' },
    { name: 'typeImage', value: parseUrlPathname(type.image) },
    { name: 'thicknessId', value: thickness.id ?? '' },
    { name: 'thicknessIndex', value: thickness.index?.toString() ?? '' },
    { name: 'thicknessImage', value: parseUrlPathname(type.image) },
    { name: 'sliceId', value: slice.id ?? '' },
    { name: 'sliceIndex', value: slice.index?.toString() ?? '' },
    { name: 'sliceImage', value: parseUrlPathname(slice.image) },
    { name: 'sliceQuantity', value: slice.quantity?.toString() ?? '' },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function pizzaV2PortionMapper(foodId: string, state: PortionSizeStates['pizza-v2']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { size, crust, unit, quantity, leftoversWeight, servingWeight } = state;

  return [
    { name: 'size', value: size?.toString() ?? '' },
    { name: 'crust', value: crust?.toString() ?? '' },
    { name: 'unit', value: unit?.toString() ?? '' },
    { name: 'quantity', value: quantity.toString() },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function standardPortionMapper(foodId: string, state: PortionSizeStates['standard-portion']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { linkedQuantity, quantity, unit, leftoversWeight, servingWeight } = state;

  return [
    { name: 'linkedQuantity', value: linkedQuantity.toString() },
    { name: 'quantity', value: quantity.toString() },
    { name: 'unitName', value: unit?.name ?? '' },
    { name: 'unitWeight', value: unit?.weight.toString() ?? '' },
    { name: 'unitOmitFoodDescription', value: unit?.omitFoodDescription.toString() ?? '' },
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export function unknownMapper(foodId: string, state: PortionSizeStates['unknown']): SurveySubmissionPortionSizeFieldCreationAttributes[] {
  const { leftoversWeight, servingWeight } = state;

  return [
    { name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ].map(psm => ({ ...psm, id: randomUUID(), foodId }));
}

export const portionSizeMappers: Record<
  keyof PortionSizeStates,
  (...arg: any[]) => SurveySubmissionPortionSizeFieldCreationAttributes[]
> = {
  'as-served': asServedMapper,
  cereal: cerealMapper,
  'direct-weight': directWeightMapper,
  'drink-scale': drinkScaleMapper,
  'guide-image': guideImageMapper,
  'milk-in-a-hot-drink': milkInAHotDrinkMapper,
  'milk-on-cereal': milkOnCerealMapper,
  'parent-food-portion': parentFoodPortionMapper,
  pizza: pizzaPortionMapper,
  'pizza-v2': pizzaV2PortionMapper,
  'recipe-builder': genericMapper,
  'standard-portion': standardPortionMapper,
  unknown: unknownMapper,
};

export type PortionSizeMappers = typeof portionSizeMappers;
