import Vue from 'vue';
import { HttpClient } from '@/types/http';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    // loading mixin
    isAppLoading: () => boolean;

    // isMobile mixin
    isMobile: () => boolean;
  }
}

declare global {
  interface Navigator {
    userLanguage: string;
  }
}
