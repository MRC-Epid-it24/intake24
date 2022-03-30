import request from 'supertest';
import type Suite from './integration-suite';
import { setPermission } from './util';

export type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

export type Options = {
  bearer?: 'superuser' | 'user' | 'respondent';
};

const sharedTests = (suite: typeof Suite) => {
  const defaultOptions: Options = { bearer: 'user' };

  const assertMissingAuthentication = async (method: Method, url: string) => {
    const { status } = await request(suite.app)[method](url).set('Accept', 'application/json');

    expect(status).toBe(401);
  };

  const assertMissingAuthorization = async (method: Method, url: string, ops?: Options) => {
    const { bearer } = ops ?? defaultOptions;

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status } = await call.send();

    expect(status).toBe(403);
  };

  const assert401and403 = async (method: Method, url: string, ops?: Options) => {
    await assertMissingAuthentication(method, url);
    await setPermission([]);
    await assertMissingAuthorization(method, url, ops);
  };

  const assertMissingInput = async (
    method: Method,
    url: string,
    fields: string[],
    ops?: Options
  ) => {
    const { bearer } = ops ?? defaultOptions;

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { status, body } = await call.send();

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(fields);
  };

  const assertMissingRecord = async (method: Method, url: string, input?: any, ops?: Options) => {
    const { bearer } = ops ?? defaultOptions;

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { status } = await call.send(input);

    expect(status).toBe(404);
  };

  const assertPaginatedResult = async (
    method: Method,
    url: string,
    empty: boolean,
    ops?: Options
  ) => {
    const { bearer } = ops ?? defaultOptions;

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status, body } = await call.send();

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArray();

    if (!empty) expect(body.data).not.toBeEmpty();
  };

  const assertReferencesResult = async (
    method: Method,
    url: string,
    fields: string[],
    ops?: Options
  ) => {
    const { bearer } = ops ?? defaultOptions;

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status, body } = await call.send();

    expect(status).toBe(200);
    expect(body).toContainAllKeys(fields);
  };

  const assertRecordDeleted = async (method: Method, url: string, ops?: Options) => {
    const { bearer } = ops ?? defaultOptions;

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status, body } = await call.send();

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
