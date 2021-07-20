import { ActionTree } from 'vuex';
import { EntryState, RootState } from '@/types';
import http from '@/services/http.service';
import { Dictionary } from '@common/types';

const actions: ActionTree<EntryState, RootState> = {
  async request({ commit, rootGetters }, { id, path, query }) {
    const name = rootGetters['resource/name'];
    commit('request');
    commit('loading/add', `${name}/entry`, { root: true });

    try {
      const url = path ? `${path}/${id}` : `admin/${name}/${id}`;

      const res = await http.get(url, { params: query });
      commit('success', res);
    } catch (err) {
      commit('error', err);
    } finally {
      commit('loading/remove', `${name}/entry`, { root: true });
    }
  },

  async update(
    { commit },
    { data, refs, addons }: Partial<Record<'data' | 'refs' | 'addons', Dictionary>>
  ) {
    commit('update', { data, refs, addons });
  },
};

export default actions;
