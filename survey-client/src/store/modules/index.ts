import { ModuleTree } from 'vuex';
import { RootState } from '@/types/vuex';
import loading from './loading';
import auth from './auth';
import survey from './survey';
import user from './user';

const modules: ModuleTree<RootState> = {
  auth,
  loading,
  survey,
  user,
};

export default modules;
