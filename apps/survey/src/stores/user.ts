import type { Subject } from '@intake24/common/security';
import { defineStore } from 'pinia';
import { tokenService } from '@intake24/ui/services';

export type UserState = {
  profile: {
    userId: string;
    subject: Subject;
  } | null;
};

export const useUser = defineStore('user', {
  state: (): UserState => ({
    profile: null,
  }),
  getters: {
    loaded: (state) => !!state.profile,
  },
  actions: {
    load(accessToken: string) {
      const { userId, sub } = tokenService.decodeAccessToken(accessToken, 'survey');

      const subject: Subject = JSON.parse(atob(sub));

      this.profile = { userId, subject };
    },
  },
});

export type UserStoreDef = typeof useUser;

export type UserStore = ReturnType<UserStoreDef>;
