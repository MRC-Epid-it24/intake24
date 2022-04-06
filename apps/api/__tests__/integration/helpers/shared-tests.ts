import { pick } from 'lodash';
import request from 'supertest';
import type Suite from './integration-suite';

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

type Options = {
  bearer?: 'superuser' | 'user' | 'respondent';
  permissions?: string[];
};

interface PaginatedOptions extends Options {
  result?: boolean | string;
}

const sharedTests = (suite: typeof Suite) => {
  const defaultOptions: Options = { bearer: 'user' };

  const assertMissingAuthentication = async (method: Method, url: string) => {
    const { status } = await request(suite.app)[method](url).set('Accept', 'application/json');

    expect(status).toBe(401);
  };

  const assertMissingAuthorization = async (method: Method, url: string, ops?: Options) => {
    const { bearer } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status } = await call.send();

    expect(status).toBe(403);
  };

  const assert401and403 = async (method: Method, url: string, ops?: Options) => {
    await assertMissingAuthentication(method, url);
    await suite.util.setPermission([]);
    await assertMissingAuthorization(method, url, ops);

    if (ops?.permissions?.length) {
      for (const permission of ops.permissions) {
        await suite.util.setPermission(permission);
        await assertMissingAuthorization(method, url, ops);
      }

      await suite.util.setPermission([]);
    }
  };

  const assertMissingInput = async (
    method: Method,
    url: string,
    fields: string[],
    ops?: Options
  ) => {
    const { bearer } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { status, body } = await call.send();

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(fields);
  };

  const assertMissingRecord = async (method: Method, url: string, input?: any, ops?: Options) => {
    const { bearer } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { status } = await call.send(input);

    expect(status).toBe(404);
  };

  const assertPaginatedResult = async (method: Method, url: string, ops?: PaginatedOptions) => {
    const { bearer, result } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status, body } = await call.send();

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArray();

    if (typeof result === 'boolean') {
      if (result) expect(body.data).not.toBeEmpty();
      else expect(body.data).toBeEmpty();
    }

    if (typeof result === 'string') {
      expect(body.data).not.toBeEmpty();

      const output = (body.data as { id: string }[]).find((item) => item.id === result);
      expect(output).toBeTruthy();
    }
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

  const assertRecord = async (method: Method, url: string, output: any, ops?: Options) => {
    const { bearer } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { body, status } = await call.send();

    expect(status).toBe(200);

    if (typeof output === 'boolean') {
      if (output) expect(body).not.toBeEmpty();
      else expect(body).toBeEmpty();
    } else expect(pick(body, Object.keys(output))).toEqual(output);
  };

  const assertRecordUpdated = async (method: Method, url: string, data: any, ops?: Options) => {
    const { bearer } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { body, status } = await call.send(data);

    expect(status).toBe(200);
    expect(pick(body, Object.keys(data))).toEqual(data);
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
    assertRecord,
    assertRecordUpdated,
    assertRecordDeleted,
  };
};

export default sharedTests;

export type SharedTests = ReturnType<typeof sharedTests>;
