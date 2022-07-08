import type VueI18n from 'vue-i18n';
import type { HttpClient, Permission } from '@intake24/ui/types';
import type { Route } from 'vue-router';
import type VueRouter from 'vue-router';
import type { Framework } from 'vuetify';
import type { HttpClient, Permission } from './types';

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: HttpClient;

    // authMixin
    can: (permission: string | string[] | Permission) => boolean;

    // loadingMixin
    isAppLoading: () => boolean;

    // isMobile mixin
    isMobile: () => boolean;

    // moduleMixin
    module: string;

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
