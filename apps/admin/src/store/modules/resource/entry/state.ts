import { EntryState } from '@/types';

const state = (): EntryState => ({
  data: {},
  refs: {},
  addons: {},
  status: '',
  error: {},
});

export default state;
