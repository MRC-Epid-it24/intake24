import { EntryState } from '@/types';

const state = (): EntryState => ({
  data: {},
  refs: {},
  addons: {},
  status: '',
  error: null,
});

export default state;
