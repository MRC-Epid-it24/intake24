import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { NutrientTableInput } from '@intake24/common/types/http/admin';
import {
  NutrientTable,
  NutrientTableCsvMapping,
  NutrientTableCsvMappingField,
  NutrientTableCsvMappingNutrient,
} from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/nutrient-tables';
  const permissions = ['nutrient-tables', 'nutrient-tables|delete'];

  let url: string;
  let invalidUrl: string;

  let input: NutrientTableInput;
  let nutrientTable: NutrientTable;

  beforeAll(async () => {
    input = mocker.foods.nutrientTable();

    nutrientTable = await NutrientTable.create(input, {
      include: [
        { model: NutrientTableCsvMapping },
        { model: NutrientTableCsvMappingField },
        { model: NutrientTableCsvMappingNutrient },
      ],
    });

    url = `${baseUrl}/${nutrientTable.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });
  });
};
