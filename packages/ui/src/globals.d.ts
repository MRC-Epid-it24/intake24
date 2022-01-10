// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';
import { HttpClient } from '@intake24/admin/types/http';
import { Permission } from '@intake24/admin/types';

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
  interface Window {
    Duo: any;
  }

  interface Navigator {
    userLanguage: string;
  }
}
