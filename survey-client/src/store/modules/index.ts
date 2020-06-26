import { ModuleTree } from 'vuex';
import { RootState } from '@/types/vuex';
import loading from './loading';
import auth from './auth';
import user from './user';

const modules: ModuleTree<RootState> = {
  auth,
  loading,
  user,
};

export default modules;
