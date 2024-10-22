import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import type { TaskRequest } from '@intake24/common/types/http/admin';
import { Task } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/tasks';
  const permissions = ['tasks', 'tasks|edit'];

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

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl);
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertAcknowledged('post', url, { result: true });
    });
  });
};
