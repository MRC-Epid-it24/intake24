import type { LocaleTranslation, RequiredLocaleTranslation } from '@intake24/common/types';
import type { HttpClient, Permission } from '@intake24/ui/types';

import type { HttpClient, Permission } from './types';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    $ti: (
      content?: LocaleTranslation | RequiredLocaleTranslation | string,
      options: LocaleContentOptions = {}
    ) => string;

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
