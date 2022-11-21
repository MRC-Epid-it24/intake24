import type { Cache } from '@intake24/api/services';
import { initCache, releaseCache } from '@intake24/api-tests/unit/helpers/cache';

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const data: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

function getData(keys: string[], expectedKeys: string[]): Promise<Record<string, number | null>> {
  expect(keys).toEqual(expectedKeys);

  const result = Object.fromEntries(keys.map((k) => [k, data[k] ?? null]));
  return Promise.resolve(result);
}

describe('Cache', () => {
  let cache: Cache;

  beforeAll(() => {
    cache = initCache();
  });

  afterAll(() => {
    releaseCache(cache);
  });

  afterEach(async () => {
    await cache.flushAll();
  });

  it('Set and get multiple items without an expiration time', async () => {
    const data = { one: 1, two: 2, three: 3 };

    await cache.mset(data);
    const cached = await cache.mget<number>(['one', 'two', 'three']);

    expect(cached).toEqual([1, 2, 3]);
  });

  it('Set and get multiple items with an expiration time', async () => {
    const data = { one: 1, two: 2, three: 3 };

    await cache.mset(data, 0.2);
    const cached = await cache.mget<number>(['one', 'two', 'three']);
    expect(cached).toEqual([1, 2, 3]);

    await delay(300);

    const cachedAfterDelay = await cache.mget<number>(['one', 'two', 'three']);
    expect(cachedAfterDelay).toEqual([null, null, null]);
  });

  it('Remember many - fetch missing', async () => {
    const stage1 = await cache.rememberMany(['one', 'two'], 'test', 60, (keys: string[]) =>
      getData(keys, ['one', 'two'])
    );

    expect(stage1).toEqual({ one: 1, two: 2 });

    const stage2 = await cache.rememberMany(
      ['one', 'two', 'three', 'four', 'five'],
      'test',
      60,
      (keys: string[]) => getData(keys, ['three', 'four', 'five'])
    );

    expect(stage2).toEqual(data);
  });

  it('Remember many - no data available', async () => {
    const response = await cache.rememberMany(['something'], 'test', 60, (keys: string[]) =>
      getData(keys, ['something'])
    );

    expect(response).toEqual({ something: null });
  });

  it('Remember many - should not crash on empty input', async () => {
    const response = await cache.rememberMany([], 'test:empty', 60, (keys: string[]) =>
      getData(keys, [])
    );

    expect(response).toEqual({});
  });
});
