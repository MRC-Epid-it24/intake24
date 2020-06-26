import { ModuleTree } from 'vuex';
import { RootState } from '@/types/vuex';
import resources from '@/router/resources';
import loading from './loading';
import auth from './auth';
import user from './user';
import list from './resource/list';
import entry from './resource/entry';
import filter from './resource/filter';

const modules: ModuleTree<RootState> = {
  auth,
  loading,
  user,
};

resources.reduce((acc, item) => {
  const { name } = item;
  acc[name] = {
    ...list(name),
    modules: {
      entry: entry(name),
      filter: filter(name),
    },
  };
  return acc;
}, modules);

export default modules;
