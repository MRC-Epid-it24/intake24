import { ModuleTree } from 'vuex';
import { RootState } from '@/types/vuex';
import loading from './loading';
import auth from './auth';
import user from './user';
import resource from './resource';
import entry from './resource/entry';

const modules: ModuleTree<RootState> = {
  auth,
  loading,
  user,
  resource: {
    ...resource,
    modules: {
      entry,
    },
  },
};

export default modules;
