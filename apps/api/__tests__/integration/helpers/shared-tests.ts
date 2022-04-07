import { pick } from 'lodash';
import request from 'supertest';
import type Suite from './integration-suite';

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

type Options = {
  bearer?: 'superuser' | 'user' | 'respondent';
  code?: number;
  permissions?: string[];
  input?: any;
};

interface PaginatedOptions extends Options {
  result?: boolean | string;
}

const sharedTests = (suite: typeof Suite) => {
  const defaultOptions: Options = { bearer: 'user' };

  const assertMissingAuthentication = async (method: Method, url: string, ops?: Options) => {
    const { input, code = 401 } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    const { status } = await call.send(input);

    expect(status).toBe(code);
  };

  const assertMissingAuthorization = async (method: Method, url: string, ops?: Options) => {
    const { bearer, code = 403, input } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status } = await call.send(input);

    expect(status).toBe(code);
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

  const assertInvalidInput = async (
    method: Method,
    url: string,
    fields: string[],
    ops?: Options
  ) => {
    const { bearer, code = 422, input } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { status, body } = await call.send(input);

    expect(status).toBe(code);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(fields);
  };

  const assertMissingRecord = async (method: Method, url: string, ops?: Options) => {
    const { bearer, code = 404, input } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { status } = await call.send(input);

    expect(status).toBe(code);
  };

  const assertPaginatedResult = async (method: Method, url: string, ops?: PaginatedOptions) => {
    const { bearer, code = 200, result } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status, body } = await call.send();

    expect(status).toBe(code);
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
    const { bearer, code = 200 } = ops ?? defaultOptions;

    const call = request(suite.app)[method](url).set('Accept', 'application/json');
    if (bearer) call.set('Authorization', suite.bearer[bearer]);

    const { status, body } = await call.send();

    expect(status).toBe(code);
    expect(body).toContainAllKeys(fields);
  };

  const assertAcknowledged = async (method: Method, url: string, ops?: Options) => {
    const { bearer, code = 200, input } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { body, status } = await call.send(input);

    expect(status).toBe(code);
    expect(body).toBeEmpty();
  };

  const assertBuffer = async (method: Method, url: string, ops?: Options) => {
    const { bearer, code = 200, input } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { body, status } = await call.send(input);

    expect(status).toBe(code);
    expect(body).toBeInstanceOf(Buffer);
  };

  const assertRecord = async (method: Method, url: string, output: any, ops?: Options) => {
    const { bearer, code = 200, input } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { body, status } = await call.send(input);

    expect(status).toBe(code);

    if (typeof output === 'boolean') {
      if (output) expect(body).not.toBeEmpty();
      else expect(body).toBeEmpty();
    } else expect(pick(body, Object.keys(output))).toEqual(output);
  };

  const assertRecordUpdated = async (method: Method, url: string, output: any, ops?: Options) => {
    const { bearer, code = 200, input = output } = { ...defaultOptions, ...ops };

    const call = request(suite.app)[method](url).set('Accept', 'application/json');

    if (bearer) call.set('Authorization', suite.bearer[bearer]);
    const { body, status } = await call.send(input);

    expect(status).toBe(code);
    expect(pick(body, Object.keys(output))).toEqual(output);
  };

  const assertRecordInserted = async (method: Method, url: string, output: any, ops?: Options) => {
    await assertRecordUpdated(method, url, output, { code: 201, ...ops });
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
    assertInvalidInput,
    assertMissingRecord,
    assertPaginatedResult,
    assertReferencesResult,
    assertAcknowledged,
    assertBuffer,
    assertRecord,
    assertRecordInserted,
    assertRecordUpdated,
    assertRecordDeleted,
  };
};

export default sharedTests;

export type SharedTests = ReturnType<typeof sharedTests>;
