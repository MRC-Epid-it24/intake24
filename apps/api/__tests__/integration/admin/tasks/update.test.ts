import { pick } from 'lodash';
import request from 'supertest';
import { TaskRequest } from '@intake24/common/types/http/admin';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { Task } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/tasks';

  let url: string;
  let invalidUrl: string;

  let input: TaskRequest;
  let updateInput: TaskRequest;
  let task: Task;

  beforeAll(async () => {
    input = mocker.system.task();
    updateInput = mocker.system.task();

    task = await Task.create(input);

    url = `${baseUrl}/${task.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('tasks|edit');
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('put', url, [
        'name',
        'job',
        'cron',
        'active',
        'params',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          name: null,
          job: true,
          cron: false,
          active: 'not-a-boolean',
          description: ['should just be string', 'should just be string'],
          params: ['invalidObject'],
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'name',
        'job',
        'cron',
        'active',
        'description',
        'params',
      ]);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, updateInput);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(updateInput))).toEqual(updateInput);
    });
  });
};
