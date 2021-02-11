import Vue from 'vue';
import { HttpClient } from '@/types/http';
import { Permission } from '@/types/vuex';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    // authMixin
    can: (permission: string | string[] | Permission) => boolean;

    // loadingMixin
    isLoading: () => boolean;

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
