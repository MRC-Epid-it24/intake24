import { pick } from 'lodash';
import request from 'supertest';

import type {
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
  NutrientTableInput,
} from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { NutrientTable } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/nutrient-tables';
  const permissions = ['nutrient-tables', 'nutrient-tables|read'];

  let url: string;
  let invalidUrl: string;

  let input: NutrientTableInput;
  let output: NutrientTableInput;
  let nutrientTable: NutrientTable;

  beforeAll(async () => {
    input = mocker.foods.nutrientTable();
    output = { ...input };

    nutrientTable = await NutrientTable.create(input, {
      include: [
        { association: 'csvMapping' },
        { association: 'csvMappingFields' },
        { association: 'csvMappingNutrients' },
      ],
    });

    url = `${baseUrl}/${nutrientTable.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);

      const {
        csvMapping: resCsvMapping,
        csvMappingFields: resCsvMappingFields,
        csvMappingNutrients: resCsvMappingNutrients,
        ...restData
      } = body;
      const {
        csvMapping: outputCsvMapping,
        csvMappingFields: outputCsvMappingFields,
        csvMappingNutrients: outputCsvMappingNutrients,
        ...restOutput
      } = output;

      // 1) match the output
      expect(pick(restData, Object.keys(restOutput))).toEqual(restOutput);
      expect(pick(resCsvMapping, Object.keys(outputCsvMapping))).toEqual(outputCsvMapping);

      // 2) non-order specific comparison
      if (outputCsvMappingFields) {
        const fields: NutrientTableCsvMappingFieldInput[] = resCsvMappingFields.map(
          ({ fieldName, columnOffset }: NutrientTableCsvMappingFieldInput) => ({
            fieldName,
            columnOffset,
          })
        );
        expect(fields).toIncludeSameMembers(outputCsvMappingFields);
      }

      if (outputCsvMappingNutrients) {
        const nutrients: NutrientTableCsvMappingNutrientInput[] = resCsvMappingNutrients.map(
          ({ nutrientTypeId, columnOffset }: NutrientTableCsvMappingNutrientInput) => ({
            nutrientTypeId,
            columnOffset,
          })
        );
        expect(nutrients).toIncludeSameMembers(outputCsvMappingNutrients);
      }
    });
  });
};
