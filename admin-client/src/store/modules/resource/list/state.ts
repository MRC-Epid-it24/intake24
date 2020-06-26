import { ListState } from '@/types/vuex';

const state = (name: string): ListState => ({
  name,
  data: [],
  refs: {},
  status: '',
  error: {},
});

export default state;
