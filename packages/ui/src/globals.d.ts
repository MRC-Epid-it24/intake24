// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';
import { HttpClient, Permission } from './types';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    // authMixin
    can: (permission: string | string[] | Permission) => boolean;

    // loadingMixin
    isAppLoading: () => boolean;

    // isMobile mixin
    isMobile: () => boolean;

    // moduleMixin
    module: string;
  }
}

declare global {
  interface Navigator {
    userLanguage: string;
  }
}
