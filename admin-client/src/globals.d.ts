import Vue from 'vue';
import { HttpClient } from '@/types/http';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    // authMixin
    can: (role: string) => boolean;

    // loadingMixin
    isLoading: () => boolean;

    // moduleMixin
    module: string;
  }
}

declare global {
  interface Window {
    Duo: any;
  }
}
