import { pick } from 'lodash';
import request from 'supertest';
import { Task } from '@/db/models/system';
import { TaskRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/tasks';

  let url: string;
  let invalidUrl: string;

  let input: TaskRequest;
  let updateInput: TaskRequest;
  let task: Task;

  beforeAll(async () => {
    input = mocker.task();
    updateInput = mocker.task();

    task = await Task.create(input);

    url = `${baseUrl}/${task.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).put(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('tasks-edit');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'job', 'cron', 'active']);
    });

    it('should return 422 when invalid input data', async () => {
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
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'job', 'cron', 'active', 'description']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);
      expect(pick(body.data, Object.keys(updateInput))).toEqual(updateInput);
    });
  });
};
