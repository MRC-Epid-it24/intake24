import { ModuleTree } from 'vuex';
import { RootState } from '@/types/vuex';
import loading from './loading';
import auth from './auth';
import recall from './recall';
import survey from './survey';
import user from './user';

const modules: ModuleTree<RootState> = {
  auth,
  loading,
  recall,
  survey,
  user,
};

export default modules;
