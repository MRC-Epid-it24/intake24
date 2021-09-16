import { Op, Transaction } from 'sequelize';
import {
  NutrientTableEntry,
  NutrientTableInput,
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
} from '@common/types/http/admin';
import {
  NutrientTable,
  NutrientTableCsvMapping,
  NutrientTableCsvMappingField,
  NutrientTableCsvMappingNutrient,
} from '@/db/models/foods';
import type { IoC } from '@/ioc';
import { NotFoundError } from '@/http/errors';

export interface NutrientTableService {
  getTable: (nutrientTableId: string) => Promise<NutrientTableEntry>;
  createTable: (input: NutrientTableInput) => Promise<NutrientTableEntry>;
  updateTable: (nutrientTableId: string, input: NutrientTableInput) => Promise<NutrientTableEntry>;
  deleteTable: (nutrientTableId: string) => Promise<void>;
}

export default ({ db }: Pick<IoC, 'db'>): NutrientTableService => {
  /**
   * Get nutrient table record with all CSV mappings
   *
   * @param {string} nutrientTableId
   * @returns {Promise<NutrientTableEntry>}
   */
  const getTable = async (nutrientTableId: string): Promise<NutrientTableEntry> => {
    const nutrientTable = await NutrientTable.findByPk(nutrientTableId, {
      include: [
        { model: NutrientTableCsvMapping, required: true },
        { model: NutrientTableCsvMappingField, separate: true, order: [['columnOffset', 'ASC']] },
        {
          model: NutrientTableCsvMappingNutrient,
          separate: true,
          order: [['columnOffset', 'ASC']],
        },
      ],
    });

    if (!nutrientTable || !nutrientTable.csvMapping) throw new NotFoundError();

    const { csvMapping, csvMappingFields = [], csvMappingNutrients = [] } = nutrientTable;

    return {
      ...nutrientTable.get(),
      csvMapping,
      csvMappingFields,
      csvMappingNutrients,
    };
  };

  /**
   * Create new nutrient table with all CSV mappings
   *
   * @param {NutrientTableInput} input
   * @returns {Promise<NutrientTableEntry>}
   */
  const createTable = async (input: NutrientTableInput): Promise<NutrientTableEntry> => {
    const { id, description } = input;

    return db.foods.transaction<NutrientTableEntry>(async (transaction) => {
      const nutrientTable = await NutrientTable.create({ id, description }, { transaction });
      const csvMapping = await NutrientTableCsvMapping.create(
        { nutrientTableId: id, ...input.csvMapping },
        { transaction }
      );

      const csvMappingFieldsInput = input.csvMappingFields.map((field) => ({
        nutrientTableId: id,
        ...field,
      }));

      const csvMappingNutrientsInput = input.csvMappingNutrients.map((field) => ({
        nutrientTableId: id,
        ...field,
      }));

      const [csvMappingFields, csvMappingNutrients] = await Promise.all([
        NutrientTableCsvMappingField.bulkCreate(csvMappingFieldsInput, { transaction }),
        NutrientTableCsvMappingNutrient.bulkCreate(csvMappingNutrientsInput, { transaction }),
      ]);

      return {
        ...nutrientTable.get(),
        csvMapping,
        csvMappingFields,
        csvMappingNutrients,
      };
    });
  };

  const updateCsvMappingFields = async (
    nutrientTableId: string,
    fields: NutrientTableCsvMappingFieldInput[],
    transaction?: Transaction
  ): Promise<NutrientTableCsvMappingField[]> => {
    const fieldNames = fields.map((field) => field.fieldName);
    await NutrientTableCsvMappingField.destroy({
      where: { nutrientTableId, fieldName: { [Op.notIn]: fieldNames } },
      transaction,
    });

    if (!fields.length) return [];

    const csvMappingFields = await NutrientTableCsvMappingField.findAll({
      where: { nutrientTableId },
      order: [['columnOffset', 'ASC']],
      transaction,
    });

    for (const field of fields) {
      const { fieldName, columnOffset } = field;

      const matchIdx = csvMappingFields.findIndex((item) => item.fieldName === fieldName);

      if (matchIdx === -1) {
        const newField = await NutrientTableCsvMappingField.create(
          {
            nutrientTableId,
            fieldName,
            columnOffset,
          },
          { transaction }
        );
        csvMappingFields.push(newField);
        continue;
      }

      await csvMappingFields[matchIdx].update({ columnOffset }, { transaction });
    }

    return csvMappingFields;
  };

  const updateCsvMappingNutrients = async (
    nutrientTableId: string,
    nutrients: NutrientTableCsvMappingNutrientInput[],
    transaction?: Transaction
  ): Promise<NutrientTableCsvMappingNutrient[]> => {
    const nutrientTypes = nutrients.map((nutrient) => nutrient.nutrientTypeId);
    await NutrientTableCsvMappingNutrient.destroy({
      where: { nutrientTableId, nutrientTypeId: { [Op.notIn]: nutrientTypes } },
      transaction,
    });

    if (!nutrients.length) return [];

    const csvMappingNutrients = await NutrientTableCsvMappingNutrient.findAll({
      where: { nutrientTableId },
      order: [['columnOffset', 'ASC']],
      transaction,
    });

    for (const nutrient of nutrients) {
      const { nutrientTypeId, columnOffset } = nutrient;

      const matchIdx = csvMappingNutrients.findIndex(
        (item) => item.nutrientTypeId === nutrientTypeId
      );

      if (matchIdx === -1) {
        const newNutrient = await NutrientTableCsvMappingNutrient.create(
          {
            nutrientTableId,
            nutrientTypeId,
            columnOffset,
          },
          { transaction }
        );
        csvMappingNutrients.push(newNutrient);
        continue;
      }

      await csvMappingNutrients[matchIdx].update({ columnOffset }, { transaction });
    }

    return csvMappingNutrients;
  };

  /**
   * Update new nutrient table with all CSV mappings
   *
   * @param {string} nutrientTableId
   * @param {NutrientTableInput} input
   * @returns {Promise<NutrientTableEntry>}
   */
  const updateTable = async (
    nutrientTableId: string,
    input: NutrientTableInput
  ): Promise<NutrientTableEntry> => {
    const { description } = input;

    const nutrientTable = await NutrientTable.findByPk(nutrientTableId, {
      include: [{ model: NutrientTableCsvMapping, required: true }],
    });
    if (!nutrientTable || !nutrientTable.csvMapping) throw new NotFoundError();

    const { csvMapping } = nutrientTable;

    return db.foods.transaction(async (transaction) => {
      await nutrientTable.update({ description }, { transaction });
      await csvMapping.update(input.csvMapping, { transaction });

      const csvMappingFields = await updateCsvMappingFields(
        nutrientTableId,
        input.csvMappingFields,
        transaction
      );

      const csvMappingNutrients = await updateCsvMappingNutrients(
        nutrientTableId,
        input.csvMappingNutrients,
        transaction
      );

      return {
        ...nutrientTable.get(),
        csvMapping,
        csvMappingFields,
        csvMappingNutrients,
      };
    });
  };

  /**
   * Delete nutrient table
   *
   * @param {string} nutrientTableId
   * @returns {Promise<void>}
   */
  const deleteTable = async (nutrientTableId: string): Promise<void> => {
    const nutrientTable = await NutrientTable.findByPk(nutrientTableId);
    if (!nutrientTable) throw new NotFoundError();

    await nutrientTable.destroy();
  };

  return {
    getTable,
    createTable,
    updateTable,
    deleteTable,
  };
};
