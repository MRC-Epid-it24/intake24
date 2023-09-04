import { defineStore } from 'pinia';

import type { Subject, SurveyTokenPayload } from '@intake24/common/security';
import { tokenService } from '@intake24/ui/services';

export type UserState = {
  profile: {
    surveyId: string;
    userId: string;
    subject: Subject;
  } | null;
};

export const useUser = defineStore('user', {
  state: (): UserState => ({
    profile: null,
  }),
  getters: {
    userId: (state) => state.profile?.userId,
    loaded: (state) => !!state.profile,
  },
  actions: {
    load(accessToken: string) {
      const { surveyId, userId, sub } = tokenService.decodeAccessToken<SurveyTokenPayload>(
        accessToken,
        'survey'
      );

      const subject: Subject = JSON.parse(atob(sub));

      this.profile = { surveyId, userId, subject };
    },
  },
});

export type UserStoreDef = typeof useUser;

export type UserStore = ReturnType<UserStoreDef>;
