import locale from './locale.controller';
import recipeFoods from './recipe-foods.controller';
import splitList from './split-list.controller';
import splitWord from './split-word.controller';
import synonymSet from './synonym-set.controller';

export * from './locale.controller';
export * from './recipe-foods.controller';
export * from './split-list.controller';
export * from './split-word.controller';
export * from './synonym-set.controller';

export default {
  locale,
  splitList,
  splitWord,
  synonymSet,
  recipeFoods,
};
