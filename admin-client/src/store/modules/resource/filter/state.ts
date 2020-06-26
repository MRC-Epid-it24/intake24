import Vue from 'vue';
import { FilterState } from '@/types/vuex';
import Storage from 'vue-ls';

Vue.use(Storage);

const state = (name: string): FilterState => ({
  name,
  data: Vue.ls.get(name, {}),
  key: name,
});

export default state;
