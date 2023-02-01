import type { HttpClient } from '@intake24/ui/types';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    // loading mixin
    isAppLoading: () => boolean;

    // platform mixin
    isMobile: boolean;
  }
}

declare global {
  interface Navigator {
    userLanguage: string;
  }
}
