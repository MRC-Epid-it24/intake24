import type { HttpClient } from '@intake24/ui/types';

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: HttpClient;

    // loading mixin
    isAppLoading: boolean;
  }
}

declare global {
  interface Navigator {
    userLanguage: string;
  }
}
