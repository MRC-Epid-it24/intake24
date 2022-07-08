import type VueI18n from 'vue-i18n';
import type { HttpClient } from '@intake24/ui/types';
import type { Route } from 'vue-router';
import type VueRouter from 'vue-router';
import type { Framework } from 'vuetify';

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: HttpClient;

    // loadingMixin
    isAppLoading: () => boolean;

    // isMobile mixin
    isMobile: () => boolean;
    isNotDesktop: () => boolean;

    // VueI18n
    readonly $i18n: VueI18n & IVueI18n;
    $t: typeof VueI18n.prototype.t;
    $tc: typeof VueI18n.prototype.tc;
    $te: typeof VueI18n.prototype.te;
    $d: typeof VueI18n.prototype.d;
    $n: typeof VueI18n.prototype.n;

    // Vue Router
    $router: VueRouter;
    $route: Route;

    // Vuetify
    $vuetify: Framework;
  }
}

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
