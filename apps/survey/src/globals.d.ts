import Vue from 'vue';
import { HttpClient } from '@intake24/survey/types/http';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    // loading mixin
    isAppLoading: () => boolean;

    // platform mixin
    isMobile: boolean;
    isNotDesktop: boolean;
  }
}

declare global {
  interface Navigator {
    userLanguage: string;
  }
}
