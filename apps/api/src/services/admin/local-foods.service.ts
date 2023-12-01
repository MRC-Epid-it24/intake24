import { randomUUID } from 'node:crypto';

import type { CreationAttributes, Transaction } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type {
  CreateLocalFoodRequest,
  CreateLocalFoodRequestOptions,
} from '@intake24/common/types/http/admin';
import type { PortionSizeMethod } from '@intake24/common/types/http/admin/portion-size';
import { ConflictError, NotFoundError } from '@intake24/api/http/errors';
import { toSimpleName } from '@intake24/api/util';
import {
  AsServedSet,
  DrinkwareSet,
  FoodLocal,
  FoodLocalList,
  FoodNutrient,
  FoodPortionSizeMethod,
  FoodPortionSizeMethodParameter,
  GuideImage,
  ImageMap,
  NutrientTableRecord,
  ProcessedImage,
} from '@intake24/db';

const localFoodsService = ({ db }: Pick<IoC, 'db'>) => {
  // TODO: This should be done when getting portion size methods data instead and the image_url
  // field in food_portion_size_methods should be dropped
  async function getPortionSizeImageUrl(
    psm: PortionSizeMethod,
    transaction: Transaction
  ): Promise<string> {
    switch (psm.method) {
      case 'as-served': {
        const set = await AsServedSet.findByPk(psm.servingImageSet, {
          include: [ProcessedImage],
          transaction,
        });

        if (set === null) throw new NotFoundError(`As served set ${psm.servingImageSet} not found`);

        if (set.selectionImage === undefined)
          throw new NotFoundError(
            `Selection screen image for as served set ${psm.servingImageSet} is undefined`
          );

        return set.selectionImage.path;
      }

      case 'guide-image': {
        const guideImage = await GuideImage.findByPk(psm.guideImageId, {
          include: [ProcessedImage],
          transaction,
        });

        if (guideImage === null)
          throw new NotFoundError(`Guide image ${psm.guideImageId} not found`);

        if (guideImage.selectionImage === undefined)
          throw new NotFoundError(
            `Selection screen image for guide image ${psm.guideImageId} is undefined`
          );

        return guideImage.selectionImage.path;
      }

      case 'drink-scale': {
        const set = await DrinkwareSet.findByPk(psm.drinkwareId, {
          include: [{ model: ImageMap, include: [ProcessedImage] }],
          transaction,
        });

        if (set === null) throw new NotFoundError(`Drinkware set ${psm.drinkwareId} not found`);

        if (set.imageMap === undefined || set.imageMap.baseImage === undefined)
          throw new NotFoundError(
            `Drink scale image map for drinkware set ${psm.drinkwareId} is undefined`
          );

        return set.imageMap.baseImage.path;
      }

      case 'standard-portion':
      case 'milk-in-a-hot-drink':
        return 'portion/standard-portion.jpg';

      case 'pizza':
        return 'portion/pizza.jpg';

      case 'cereal':
      case 'milk-on-cereal':
        return 'portion/cereal.jpg';

      default:
        throw new Error(
          `Unexpected portion size method type: ${(psm as PortionSizeMethod).method}`
        );
    }
  }

  function toPsmParameterAttrs(
    psm: PortionSizeMethod
  ): CreationAttributes<FoodPortionSizeMethodParameter>[] {
    const params: CreationAttributes<FoodPortionSizeMethodParameter>[] = [];

    switch (psm.method) {
      case 'as-served':
        params.push({ name: 'serving-image-set', value: psm.servingImageSet });
        if (psm.leftoversImageSet !== undefined)
          params.push({ name: 'leftovers-image-set', value: psm.leftoversImageSet });
        break;

      case 'guide-image':
        params.push({ name: 'guide-image-id', value: psm.guideImageId });
        break;

      case 'drink-scale':
        params.push({ name: 'drinkware-id', value: psm.drinkwareId });
        params.push({ name: 'initial-fill-level', value: psm.initialFillLevel.toString() });
        params.push({ name: 'skip-fill-level', value: psm.skipFillLevel.toString() });
        break;

      case 'standard-portion':
        params.push({ name: 'units-count', value: psm.units.length.toString() });

        for (let i = 0; i < psm.units.length; ++i) {
          params.push({ name: `unit${i}-name`, value: psm.units[i].name });
          params.push({
            name: `unit${i}-omit-food-description`,
            value: psm.units[i].omitFoodDescription.toString(),
          });
          params.push({ name: `unit${i}-weight`, value: psm.units[i].weight.toString() });

          const inlineEstimateIn = psm.units[i].inlineEstimateIn;

          if (inlineEstimateIn !== undefined) {
            params.push({ name: `unit${i}-inline-estimate-in`, value: inlineEstimateIn });
          }

          const inlineHowMany = psm.units[i].inlineHowMany;

          if (inlineHowMany !== undefined) {
            params.push({ name: `unit${i}-inline-how-many`, value: inlineHowMany });
          }
        }
        break;

      case 'milk-in-a-hot-drink':
        break;

      case 'pizza':
        break;

      case 'cereal':
        params.push({ name: 'type', value: psm.type });
        break;

      case 'milk-on-cereal':
        break;

      default:
        throw new Error(
          `Unexpected portion size method type: ${(psm as PortionSizeMethod).method}`
        );
    }

    return params;
  }

  async function toPortionSizeMethodAttrs(
    foodLocalId: string,
    psm: PortionSizeMethod,
    transaction: Transaction
  ): Promise<
    CreationAttributes<FoodPortionSizeMethod> & {
      parameters: CreationAttributes<FoodPortionSizeMethodParameter>[];
    }
  > {
    const imageUrl = await getPortionSizeImageUrl(psm, transaction);

    return {
      foodLocalId,
      method: psm.method,
      description: psm.description,
      imageUrl,
      useForRecipes: psm.useForRecipes,
      conversionFactor: psm.conversionFactor,
      orderBy: '1',
      parameters: toPsmParameterAttrs(psm),
    };
  }

  async function updatePortionSizeMethodsImpl(
    foodLocalId: string,
    methods: PortionSizeMethod[],
    transaction: Transaction
  ) {
    const creationAttributes = await Promise.all(
      methods.map((psm) => toPortionSizeMethodAttrs(foodLocalId, psm, transaction))
    );

    await FoodPortionSizeMethod.destroy({ where: { foodLocalId }, transaction });

    await FoodPortionSizeMethod.bulkCreate(creationAttributes, {
      include: [{ model: FoodPortionSizeMethodParameter, as: 'parameters' }],
      transaction,
    });
  }

  async function updateNutrientMappingImpl(
    foodLocalId: string,
    nutrientTableReferences: Record<string, string>,
    transaction: Transaction
  ) {
    const tableIds = new Set<string>();
    const recordIds = new Set<string>();

    Object.entries(nutrientTableReferences).forEach(([tableId, recordId]) => {
      tableIds.add(tableId);
      recordIds.add(recordId);
    });

    const nutrientTableRecords = await NutrientTableRecord.findAll({
      where: {
        nutrientTableId: [...tableIds],
        nutrientTableRecordId: [...recordIds],
      },
      transaction,
    });

    const nutrientTableRecordIds: string[] = [];

    Object.entries(nutrientTableReferences).forEach(([nutrientTableId, nutrientTableRecordId]) => {
      const record = nutrientTableRecords.find(
        (record) =>
          record.nutrientTableId === nutrientTableId &&
          record.nutrientTableRecordId === nutrientTableRecordId
      );

      if (record === undefined)
        throw new Error(
          `Could not find food nutrient table record: ${nutrientTableId}/${nutrientTableRecordId}`
        );

      nutrientTableRecordIds.push(record.id);
    });

    const creationAttributes = nutrientTableRecordIds.map((nutrientTableRecordId) => ({
      foodLocalId,
      nutrientTableRecordId,
    }));

    await FoodNutrient.destroy({ where: { foodLocalId }, transaction });

    await FoodNutrient.bulkCreate(creationAttributes, { transaction });
  }

  async function createImpl(
    localeId: string,
    request: CreateLocalFoodRequest,
    options: CreateLocalFoodRequestOptions,
    transaction: Transaction
  ): Promise<boolean> {
    let created = false;

    // Postgres invalidates transactions if any query fails (error 25P02, "current transaction is
    // aborted, commands ignored until end of transaction block"), so it is not possible to attempt
    // creating a new record and handle the potential conflict error in the same transaction, and
    // rolling back the transaction would make ensuring atomicity complicated.

    // Manually checking for an existing record is not ideal (database constraints could change and
    // become out of sync with this code) but good enough.

    let instance = await FoodLocal.findOne({
      where: { localeId, foodCode: request.code },
      transaction,
    });

    if (instance !== null) {
      if (options.update) {
        instance.name = request.name;
        instance.simpleName = toSimpleName(request.name);
        instance.version = randomUUID();

        await instance.save({ transaction });
      } else {
        throw new ConflictError(
          `A record already exists for ${request.code} in locale ${localeId}`
        );
      }
    } else {
      instance = await FoodLocal.create(
        {
          localeId,
          foodCode: request.code,
          name: request.name,
          version: randomUUID(),
          simpleName: toSimpleName(request.name),
        },
        { transaction }
      );

      created = true;
    }

    await updatePortionSizeMethodsImpl(instance.id, request.portionSizeMethods, transaction);

    await updateNutrientMappingImpl(instance.id, request.nutrientTableCodes, transaction);

    // TODO: update associated foods

    return created;
  }

  const updatePortionSizeMethods = async (
    foodLocalId: string,
    methods: PortionSizeMethod[],
    transaction?: Transaction
  ): Promise<void> => {
    if (transaction !== undefined)
      await updatePortionSizeMethodsImpl(foodLocalId, methods, transaction);
    else {
      await db.foods.transaction(async (t) => {
        await updatePortionSizeMethodsImpl(foodLocalId, methods, t);
      });
    }
  };

  const create = async (
    localeId: string,
    request: CreateLocalFoodRequest,
    options: CreateLocalFoodRequestOptions,
    transaction?: Transaction
  ): Promise<boolean> => {
    if (transaction !== undefined) {
      return await createImpl(localeId, request, options, transaction);
    } else {
      return await db.foods.transaction(async (transaction) => {
        return await createImpl(localeId, request, options, transaction);
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const read = async (localeId: string, foodCode: string, transaction?: Transaction) => {};

  const updateEnabledFoods = async (localeId: string, enabledFoods: string[]) => {
    return await db.foods.transaction(async (transaction) => {
      await FoodLocalList.destroy({ where: { localeId }, transaction });
      const records = enabledFoods.map((foodCode) => ({ localeId, foodCode }));
      await FoodLocalList.bulkCreate(records, { transaction });
    });
  };

  return {
    create,
    read,
    updatePortionSizeMethods,
    updateEnabledFoods,
  };
};

export default localFoodsService;

export type LocalFoodsService = ReturnType<typeof localFoodsService>;
