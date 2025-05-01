import type { CreationAttributes, Transaction } from 'sequelize';

import { randomUUID } from 'node:crypto';

import fs from 'node:fs';

import { ConflictError, NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { toSimpleName } from '@intake24/api/util';
import type { PortionSizeMethod } from '@intake24/common/surveys';
import type {
  CreateLocalFoodRequest,
  CreateLocalFoodRequestOptions,
} from '@intake24/common/types/http/admin';
import type { AssociatedFood as HttpAssociatedFood } from '@intake24/common/types/http/admin/associated-food';
import {
  AssociatedFood,
  FoodLocal,
  FoodLocalList,
  FoodNutrient,
  FoodPortionSizeMethod,
  NutrientTableRecord,
} from '@intake24/db';

function localFoodsService({ db }: Pick<IoC, 'db'>) {
  async function toPortionSizeMethodAttrs(
    foodLocalId: string,
    psm: PortionSizeMethod,
  ): Promise<CreationAttributes<FoodPortionSizeMethod>> {
    return {
      foodLocalId,
      method: psm.method,
      description: psm.description,
      useForRecipes: psm.useForRecipes,
      conversionFactor: psm.conversionFactor,
      orderBy: '1',
      parameters: psm.parameters,
    };
  }

  function toAssociatedFoodAttrs(
    localeId: string,
    foodCode: string,
    index: number,
    httpAssociatedFood: HttpAssociatedFood,
  ): CreationAttributes<AssociatedFood> {
    return {
      foodCode,
      localeId,
      associatedFoodCode: httpAssociatedFood.foodCode,
      associatedCategoryCode: httpAssociatedFood.categoryCode,
      text: httpAssociatedFood.promptText,
      genericName: httpAssociatedFood.genericName,
      linkAsMain: httpAssociatedFood.linkAsMain,
      multiple: httpAssociatedFood.allowMultiple,
      orderBy: index.toString(),
    };
  }

  async function updateAssociatedFoodsImpl(
    localeId: string,
    foodCode: string,
    associatedFoods: HttpAssociatedFood[],
    transaction: Transaction,
  ) {
    const creationAttributes = associatedFoods.map((af, index) => toAssociatedFoodAttrs(localeId, foodCode, index, af));

    await AssociatedFood.destroy({ where: { localeId, foodCode }, transaction });

    await AssociatedFood.bulkCreate(creationAttributes, { transaction });
  }

  async function updatePortionSizeMethodsImpl(
    foodLocalId: string,
    methods: PortionSizeMethod[],
    transaction: Transaction,
  ) {
    const creationAttributes = await Promise.all(
      methods.map(psm => toPortionSizeMethodAttrs(foodLocalId, psm)),
    );

    await FoodPortionSizeMethod.destroy({ where: { foodLocalId }, transaction });

    await FoodPortionSizeMethod.bulkCreate(creationAttributes, { transaction });
  }

  async function updateNutrientMappingImpl(
    foodLocalId: string,
    nutrientTableReferences: Record<string, string>,
    transaction: Transaction,
  ) {
    const tableIds = new Set<string>();
    const recordIds = new Set<string>();
    const missingRecords: string[] = [];

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
        record =>
          record.nutrientTableId === nutrientTableId
          && record.nutrientTableRecordId === nutrientTableRecordId,
      );

      if (record === undefined) {
        const missingRef = `${nutrientTableId}/${nutrientTableRecordId}`;
        missingRecords.push(missingRef);
        console.warn(`Could not find food nutrient table record: ${missingRef}`);
        return;
      }

      nutrientTableRecordIds.push(record.id);
    });

    // Log missing records to a file if any were found
    if (missingRecords.length > 0) {
      const logEntry = `${new Date().toISOString()}: Missing nutrient records for foodLocalId ${foodLocalId}: ${missingRecords.join(', ')}\n`;
      await fs.promises.appendFile('missing-nutrient-records.log', logEntry);
    }

    // Only proceed with creating records if we found any valid ones
    if (nutrientTableRecordIds.length > 0) {
      const creationAttributes = nutrientTableRecordIds.map(nutrientTableRecordId => ({
        foodLocalId,
        nutrientTableRecordId,
      }));

      await FoodNutrient.destroy({ where: { foodLocalId }, transaction });
      await FoodNutrient.bulkCreate(creationAttributes, { transaction });
    }
  }

  async function createImpl(
    localeId: string,
    request: CreateLocalFoodRequest,
    options: CreateLocalFoodRequestOptions,
    transaction: Transaction,
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
        instance.altNames = request.altNames ?? {};
        instance.tags = request.tags ?? [];
        instance.version = randomUUID();

        await instance.save({ transaction });
      }
      else {
        throw new ConflictError(
          `A record already exists for ${request.code} in locale ${localeId}`,
        );
      }
    }
    else {
      instance = await FoodLocal.create(
        {
          localeId,
          foodCode: request.code,
          name: request.name,
          altNames: request.altNames,
          tags: request.tags,
          version: randomUUID(),
          simpleName: toSimpleName(request.name),
        },
        { transaction },
      );

      created = true;
    }

    await updatePortionSizeMethodsImpl(instance.id, request.portionSizeMethods, transaction);

    await updateNutrientMappingImpl(instance.id, request.nutrientTableCodes, transaction);

    await updateAssociatedFoodsImpl(localeId, request.code, request.associatedFoods, transaction);

    return created;
  }

  const updatePortionSizeMethods = async (
    foodLocalId: string,
    methods: PortionSizeMethod[],
    transaction?: Transaction,
  ): Promise<void> => {
    if (transaction !== undefined) {
      await updatePortionSizeMethodsImpl(foodLocalId, methods, transaction);
    }
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
    transaction?: Transaction,
  ): Promise<boolean> => {
    if (transaction !== undefined) {
      return await createImpl(localeId, request, options, transaction);
    }
    else {
      return await db.foods.transaction(async (transaction) => {
        return await createImpl(localeId, request, options, transaction);
      });
    }
  };

  const readImpl = async (
    localeId: string,
    foodCode: string,
    transaction: Transaction,
  ) => {
    const foodLocal = await FoodLocal.findOne({
      where: { localeId, foodCode },
      transaction,
    });

    if (foodLocal === null)
      throw new NotFoundError();

    const portionSizeRows = await FoodPortionSizeMethod.findAll(
      {
        where: { foodLocalId: foodLocal.id },
        attributes: ['method', 'description', 'useForRecipes', 'conversionFactor', 'orderBy', 'parameters'],
        transaction,
      },
    );

    const portionSizeMethods: PortionSizeMethod[] = portionSizeRows.map(row => (
      {
        method: row.method,
        conversionFactor: row.conversionFactor,
        description: row.description,
        useForRecipes: row.useForRecipes,
        orderBy: row.orderBy,
        parameters: row.parameters,
      } as PortionSizeMethod));

    return {
      foodCode,
      localeId,
      id: foodLocal.id,
      version: foodLocal.version,
      name: foodLocal.name,
      portionSizeMethods,
    };
  };

  const read = async (localeId: string, foodCode: string, transaction?: Transaction) => {
    if (transaction !== undefined) {
      return await readImpl(localeId, foodCode, transaction);
    }
    else {
      return await db.foods.transaction(async (transaction) => {
        return await readImpl(localeId, foodCode, transaction);
      });
    }
  };

  const readEnabledFoods = async (localeId: string): Promise<string[]> => {
    const rows = await FoodLocalList.findAll({ where: { localeId }, attributes: ['foodCode'] });
    return rows.map(row => row.foodCode);
  };

  const updateEnabledFoods = async (localeId: string, enabledFoods: string[]) => {
    return await db.foods.transaction(async (transaction) => {
      await FoodLocalList.destroy({ where: { localeId }, transaction });
      const records = enabledFoods.map(foodCode => ({ localeId, foodCode }));
      await FoodLocalList.bulkCreate(records, { transaction });
    });
  };

  return {
    create,
    read,
    readEnabledFoods,
    updatePortionSizeMethods,
    updateEnabledFoods,
  };
}

export default localFoodsService;

export type LocalFoodsService = ReturnType<typeof localFoodsService>;
