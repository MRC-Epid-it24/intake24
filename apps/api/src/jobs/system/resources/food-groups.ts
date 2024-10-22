import type { ResourceOps } from './resource';

import { Readable } from 'node:stream';

import { Transform } from '@json2csv/node';

export async function foodGroups({ kyselyDb }: ResourceOps) {
  const { total } = await kyselyDb.foods.selectFrom('foodGroups').select(({ fn }) => [
    fn.count<number>('id').as('total'),
  ]).executeTakeFirstOrThrow();
  const cursor = kyselyDb.foods.selectFrom('foodGroups').selectAll().orderBy('id').stream();
  const records = Readable.from(cursor);

  const transform = new Transform(
    { fields: ['id', 'name'], withBOM: true },
    {},
    { objectMode: true },
  );

  return { total, records, transform };
}
