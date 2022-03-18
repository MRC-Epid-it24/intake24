import request from 'supertest';
import { TaskRequest } from '@intake24/common/types/http/admin';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { Task } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/tasks';

  let url: string;
  let invalidUrl: string;

  let input: TaskRequest;
  let task: Task;

  beforeAll(async () => {
    input = mocker.system.task();
    task = await Task.create(input);

    url = `${baseUrl}/${task.id}/run`;
    invalidUrl = `${baseUrl}/999999/run`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('tasks|edit');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(body).toBeEmpty();
    });
  });
};
