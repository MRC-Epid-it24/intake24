import type { StandardUnitCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/standard-units';
  const permissions = ['standard-units', 'standard-units|create'];

  let input: StandardUnitCreationAttributes;
  let output: StandardUnitCreationAttributes;

  beforeAll(async () => {
    input = mocker.foods.standardUnit();
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
      await suite.sharedTests.assertInvalidInput('post', url, ['id', 'estimateIn', 'howMany']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['id', 'estimateIn.en', 'howMany'], {
        input: {
          id: { value: 'should be string' },
          estimateIn: { en: { value: 'test' } },
          howMany: 'ten',
        },
      });
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 422 for duplicate id', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['id'], { input });
    });
  });
};
