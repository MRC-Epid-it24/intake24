import type { LocaleTranslation, RequiredLocaleTranslation } from '@intake24/common/types';
import type { HttpClient } from '@intake24/ui/types';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    $ti: (
      content?: LocaleTranslation | RequiredLocaleTranslation | string,
      options: LocaleContentOptions = {}
    ) => string;

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
