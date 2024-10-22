import type { ResourceOps } from './resource';

import { Readable } from 'node:stream';
import { Transform } from '@json2csv/node';

import { sql } from 'kysely';

import { UnwrapAII } from '@intake24/common/types';

export async function drinkwareScales({ kyselyDb, params: { language = ['en'] } }: ResourceOps) {
  const { total } = await kyselyDb.foods.selectFrom('drinkwareScales').select(({ fn }) => [
    fn.count<number>('id').as('total'),
  ]).executeTakeFirstOrThrow();
  const cursor = kyselyDb.foods
    .selectFrom('drinkwareScales')
    .innerJoin('drinkwareSets', 'drinkwareSets.id', 'drinkwareScales.drinkwareSetId')
    .select([
      'drinkwareScales.drinkwareSetId',
      'drinkwareSets.description',
      'drinkwareScales.choiceId',
      'drinkwareScales.width',
      'drinkwareScales.height',
      'drinkwareScales.emptyLevel',
      'drinkwareScales.fullLevel',
      'drinkwareScales.baseImageUrl',
      'drinkwareScales.overlayImageUrl',
      'drinkwareScales.label',
    ])
    .orderBy(sql`lower(drinkware_sets.id)`)
    .orderBy('choiceId')
    .stream();
  const records = Readable.from(cursor);

  const transform = new Transform(
    {
      fields: [
        'drinkwareSetId',
        'description',
        'choiceId',
        'width',
        'height',
        'emptyLevel',
        'fullLevel',
        'baseImageUrl',
        'overlayImageUrl',
        'label',
        ...language.map(lang => ({
          label: `label.${lang}`,
          value: (row: UnwrapAII<typeof cursor>) => row.label ? JSON.parse(row.label)[lang] : undefined,
        })),
      ],
      withBOM: true,
    },
    {},
    { objectMode: true },
  );

  return { total, records, transform };
}
