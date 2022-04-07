import { pick } from 'lodash';
import request from 'supertest';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import {
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
  NutrientTableInput,
} from '@intake24/common/types/http/admin';

export default () => {
  const url = '/api/admin/nutrient-tables';
  const permissions = ['nutrient-tables', 'nutrient-tables|create'];

  let input: NutrientTableInput;
  let output: NutrientTableInput;

  beforeAll(async () => {
    input = mocker.foods.nutrientTable();
    output = { ...input };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'id',
        'description',
        'csvMapping.rowOffset',
        'csvMapping.idColumnOffset',
        'csvMapping.descriptionColumnOffset',
        'csvMappingFields',
        'csvMappingNutrients',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'post',
        url,
        [
          'id',
          'description',
          'csvMapping.rowOffset',
          'csvMapping.idColumnOffset',
          'csvMapping.descriptionColumnOffset',
          'csvMappingFields',
          'csvMappingNutrients',
        ],
        {
          input: {
            id: null,
            description: [],
            csvMapping: { missingProps: false },
            csvMappingFields: [{ invalidField: 'fieldname' }],
            csvMappingNutrients: [{ invalidField: 'fieldname' }],
          },
        }
      );
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);

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

    it('should return 422 for duplicate id', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['id'], { input });
    });
  });
};
