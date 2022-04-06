import { defineStore } from 'pinia';
import { tokenService } from '../services';
import { UserPayload } from '../types/auth';

export type UserState = {
  profile: UserPayload | null;
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
      const decoded = tokenService.decodeAccessToken(accessToken);
      if (!decoded) return;

      this.profile = { ...this.profile, ...decoded };
    },
  },
});

export type UserStoreDef = typeof useUser;

export type UserStore = ReturnType<UserStoreDef>;
