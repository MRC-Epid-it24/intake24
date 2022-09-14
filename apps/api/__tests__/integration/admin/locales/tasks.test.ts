import request from 'supertest';

import type { QueueLocaleTaskInput } from '@intake24/api/services';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|tasks'];

  let url: string;
  let invalidUrl: string;
  let localeId: string;

  let input: Omit<QueueLocaleTaskInput, 'userId'>;

  beforeAll(async () => {
    localeId = suite.data.system.locale.id;

    input = {
      job: 'PairwiseSearchCopyAssociations',
      params: {
        sourceLocaleId: localeId,
        targetLocaleId: 'some-locale',
      },
    };

    url = `${baseUrl}/${localeId}/tasks`;
    invalidUrl = `${baseUrl}/invalid-locale/tasks`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['job', 'params']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['job', 'params'], {
        input: [{ job: 'invalidJobType', params: { surveyId: 'demo', nonValidKey: false } }],
      });
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl, { input });
    });

    it('should return 200 and job resource', async () => {
      await suite.util.setPermission(permissions);

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(200);
      expect(body.type).toBe(input.job);
    });
  });
};
