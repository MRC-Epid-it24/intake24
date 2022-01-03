import { pick } from 'lodash';
import request from 'supertest';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import {
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
  NutrientTableInput,
} from '@common/types/http/admin';
import {
  NutrientTable,
  NutrientTableCsvMapping,
  NutrientTableCsvMappingField,
  NutrientTableCsvMappingNutrient,
} from '@api/db';

export default (): void => {
  const baseUrl = '/api/admin/nutrient-tables';

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
        { model: NutrientTableCsvMapping },
        { model: NutrientTableCsvMappingField },
        { model: NutrientTableCsvMappingNutrient },
      ],
    });

    url = `${baseUrl}/${nutrientTable.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('nutrient-tables-read');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
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
