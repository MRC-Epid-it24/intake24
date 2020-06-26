import { EntryState } from '@/types/vuex';

const state = (name: string): EntryState => ({
  name,
  data: {},
  refs: {},
  addons: {},
  status: '',
  error: {},
});

export default state;
