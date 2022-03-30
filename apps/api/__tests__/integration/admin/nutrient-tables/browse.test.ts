import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import {
  NutrientTable,
  NutrientTableCsvMapping,
  NutrientTableCsvMappingField,
  NutrientTableCsvMappingNutrient,
} from '@intake24/db';

export default () => {
  const url = '/api/admin/nutrient-tables';

  beforeAll(async () => {
    const input = mocker.foods.nutrientTable();
    await NutrientTable.create(input, {
      include: [
        { model: NutrientTableCsvMapping },
        { model: NutrientTableCsvMappingField },
        { model: NutrientTableCsvMappingNutrient },
      ],
    });
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and paginated results', async () => {
    await setPermission('nutrient-tables|browse');

    await suite.sharedTests.assertPaginatedResult('get', url, false);
  });
};
