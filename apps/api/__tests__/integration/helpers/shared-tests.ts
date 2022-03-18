import request from 'supertest';
import type Suite from './integration-suite';
import { setPermission } from './util';

export type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

const sharedTests = (suite: typeof Suite) => {
  const assertMissingAuthentication = async (method: Method, url: string) => {
    const { status } = await request(suite.app)[method](url).set('Accept', 'application/json');

    expect(status).toBe(401);
  };

  const assertMissingAuthorization = async (method: Method, url: string) => {
    const { status } = await request(suite.app)
      [method](url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  };

  const assert401and403 = async (method: Method, url: string) => {
    await assertMissingAuthentication(method, url);
    await setPermission([]);
    await assertMissingAuthorization(method, url);
  };

  const assertMissingInput = async (method: Method, url: string, fields: string[]) => {
    const { status, body } = await request(suite.app)
      [method](url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(fields);
  };

  const assertMissingRecord = async (method: Method, url: string, input?: any) => {
    const { status } = await request(suite.app)
      [method](url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user)
      .send(input);

    expect(status).toBe(404);
  };

  const assertPaginatedResult = async (method: Method, url: string, empty = false) => {
    const { status, body } = await request(suite.app)
      [method](url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArray();

    if (!empty) expect(body.data).not.toBeEmpty();
  };

  const assertReferencesResult = async (method: Method, url: string, fields: string[]) => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(fields);
  };

  const assertRecordDeleted = async (method: Method, url: string) => {
    const { status, body } = await request(suite.app)
      [method](url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(204);
    expect(body).toBeEmpty();
  };

  return {
    assertMissingAuthentication,
    assertMissingAuthorization,
    assert401and403,
    assertMissingInput,
    assertMissingRecord,
    assertPaginatedResult,
    assertReferencesResult,
    assertRecordDeleted,
  };
};

export default sharedTests;

export type SharedTests = ReturnType<typeof sharedTests>;
