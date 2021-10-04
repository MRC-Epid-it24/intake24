import { pick } from 'lodash';
import request from 'supertest';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import {
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
  NutrientTableInput,
} from '@common/types/http/admin';

export default (): void => {
  const url = '/api/admin/nutrient-tables';

  let input: NutrientTableInput;
  let output: NutrientTableInput;

  beforeAll(async () => {
    input = mocker.foods.nutrientTable();
    output = { ...input };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('nutrient-tables-create');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'description',
        'csvMapping',
        'csvMappingFields',
        'csvMappingNutrients',
      ]);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: null,
          description: [],
          csvMapping: { missingProps: false },
          csvMappingFields: [{ invalidField: 'fieldname' }],
          csvMappingNutrients: [{ invalidField: 'fieldname' }],
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'description',
        'csvMapping',
        'csvMappingFields',
        'csvMappingNutrients',
      ]);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);
      expect(body).toContainAllKeys(['data']);

      const {
        csvMapping: resCsvMapping,
        csvMappingFields: resCsvMappingFields,
        csvMappingNutrients: resCsvMappingNutrients,
        ...restData
      } = body.data;
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

    it('should return 422 when duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });
  });
};
