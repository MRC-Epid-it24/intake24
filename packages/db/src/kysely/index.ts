import type { DB as FoodsDB } from './foods';
import type { DB as SystemDB } from './system';

export { FoodsDB, SystemDB };

// This needs to be a feature in kysely-codegen
export type {
  DrinkwareScales as DrinkwareScalesColumns,
  DrinkwareScalesV2 as DrinkwareScalesV2Columns,
  DrinkwareSets as DrinkwareSetsColumns,
  DrinkwareVolumeSamples as DrinkwareVolumeSamplesColumns,
} from './foods';
