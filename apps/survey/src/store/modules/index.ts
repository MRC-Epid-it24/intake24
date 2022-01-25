import { ModuleTree } from 'vuex';
import { RootState } from '@intake24/survey/types/vuex';
import loading from './loading';
import auth from './auth';
import feedback from './feedback';
import survey from './survey';
import user from './user';

const modules: ModuleTree<RootState> = {
  auth,
  feedback,
  loading,
  survey,
  user,
};

export default modules;
