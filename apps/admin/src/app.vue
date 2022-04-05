<template>
  <v-app>
    <loader :show="isAppLoading" />
    <v-navigation-drawer v-if="loggedIn" v-model="sidebar" app dark color="primary">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="my-1 title">{{ $t('common._') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item-group>
          <v-list-item :to="{ name: 'dashboard' }" link>
            <v-list-item-action>
              <v-icon>fas fa-fw fa-tachometer-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('dashboard._') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <menu-tree
        v-if="can(['fdbs|browse', 'food-groups|browse', 'nutrient-tables|browse'])"
        icon="fas fa-fw fa-hamburger"
        name="fdb"
        :resources="resources.fdb"
      ></menu-tree>
      <menu-tree
        v-if="can(['languages|browse', 'locales|browse'])"
        icon="fas fa-fw fa-globe"
        name="local"
        :resources="resources.local"
      ></menu-tree>
      <menu-tree
        v-if="can(['as-served|browse', 'guide-images|browse', 'image-maps|browse'])"
        icon="fas fa-fw fa-images"
        name="images"
        :resources="resources.images"
      ></menu-tree>
      <menu-tree
        v-if="
          can([
            'feedback-schemes|browse',
            'survey-schemes|browse',
            'scheme-questions|browse',
            'surveys|browse',
          ])
        "
        icon="fas fa-fw fa-tools"
        name="surveyMgmt"
        :resources="resources.surveyMgmt"
      ></menu-tree>
      <menu-tree
        v-if="can('acl')"
        icon="fas fa-fw fa-low-vision"
        name="acl"
        :resources="resources.acl"
      ></menu-tree>
      <menu-tree
        v-if="can(['jobs|browse', 'sign-in-logs|browse', 'tasks|browse'])"
        icon="fas fa-fw fa-tools"
        name="system"
        :resources="resources.system"
      ></menu-tree>
    </v-navigation-drawer>

    <v-app-bar app dark color="secondary" fixed>
      <template v-if="loggedIn">
        <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn text :to="{ name: 'user' }">
          <span class="mr-2">{{ $t('user._') }}</span>
          <v-icon>$user</v-icon>
        </v-btn>
        <confirm-dialog :label="$t('common.logout._')" @confirm="logout">
          <template v-slot:activator="{ attrs, on }">
            <v-btn text v-bind="attrs" v-on="on">
              <span>{{ $t('common.logout._') }}</span>
              <v-icon right>$logout</v-icon>
            </v-btn>
          </template>
          {{ $t('common.logout.text') }}
        </confirm-dialog>
      </template>
      <template v-else>
        <v-toolbar-title>{{ $t('common._') }}</v-toolbar-title>
      </template>
    </v-app-bar>

    <v-main>
      <v-container :class="{ 'pa-0': isMobile }" fluid>
        <v-breadcrumbs v-if="breadcrumbs.length" :items="breadcrumbs" large>
          <template v-slot:divider>
            <v-icon>fas fa-caret-right</v-icon>
          </template>
        </v-breadcrumbs>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-snackbar :value="updateExists" :timeout="-1" color="primary">
      {{ $t('common.sw.check') }}
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="refreshApp">{{ $t('common.sw.update') }}</v-btn>
      </template>
    </v-snackbar>

    <!-- <v-footer app> </v-footer> -->
  </v-app>
</template>

<script lang="ts">
import groupBy from 'lodash/groupBy';
import pluralize from 'pluralize';
import Vue, { VueConstructor } from 'vue';
import { Location } from 'vue-router';
import { Dictionary } from '@intake24/common/types';
import { ConfirmDialog, pwaUpdate, setsLanguage } from '@intake24/ui';
import Loader from '@intake24/admin/components/loader.vue';
import MenuTree from '@intake24/admin/components/sidebar/menu-tree.vue';
import webPush from '@intake24/admin/components/web-push/web-push';
import resources from '@intake24/admin/router/resources';
import { mapState } from 'pinia';
import { useApp, useAuth, useEntry } from '@intake24/admin/stores';

export interface AppComponent {
  sidebar: boolean;
  toggleSidebar: () => void;
  buildBreadCrumb(module: string, action: string, params: Dictionary, parent?: string): any[];
}

type Breadcrumbs = {
  disabled?: boolean;
  exact?: boolean;
  href?: string;
  link?: boolean;
  text: string | number;
  to?: string | Location;
};

type Mixins = InstanceType<typeof pwaUpdate> &
  InstanceType<typeof setsLanguage> &
  InstanceType<typeof webPush>;

export default (Vue as VueConstructor<Vue & AppComponent & Mixins>).extend({
  name: 'App',

  components: { ConfirmDialog, Loader, MenuTree },

  mixins: [pwaUpdate, setsLanguage, webPush],

  data() {
    return {
      resources: groupBy(resources, 'group'),
      sidebar: true,
    };
  },

  computed: {
    ...mapState(useApp, ['app']),
    ...mapState(useAuth, ['loggedIn']),
    ...mapState(useEntry, { entry: 'data' }),

    breadcrumbs(): Breadcrumbs[] {
      const { meta: { module, action } = {}, params } = this.$route;
      if (!module || !action) return [];

      const { current, parent } = module;
      return this.buildBreadCrumb(current, action, params, parent);
    },

    title() {
      if (this.$route.meta?.title) return this.$t(this.$route.meta.title);

      if (!this.module) return this.app.name;

      const { id, name } = this.entry;

      return name ?? id ?? this.$t(`${this.module}.title`);
    },
  },

  watch: {
    title: {
      handler(val) {
        document.title = val;
      },
      immediate: true,
    },
  },

  async created() {
    this.$http.init(this.$router);

    const userLanguage = this.$ls.get('language', navigator.language || navigator.userLanguage);
    // TODO: not the most elegant solution. Forcing fallback to broader language locales if browser is set to the regional one (like, en-US or en-GB)
    await this.setLanguage(
      'admin',
      userLanguage.includes('-') ? userLanguage.split('-')[0] : userLanguage
    );
  },

  async mounted() {
    if (!this.loggedIn && this.$route.name === 'login') {
      const { state, code } = this.$route.query;

      // MFA verification -> do not refresh yet
      if ([state, code].every((item) => typeof item === 'string' && item.length)) return;

      try {
        await useAuth().refresh();
        await this.$router.push({ name: 'dashboard' });
      } catch (err) {
        // continue
      }
    }

    if (!this.loggedIn) return;

    // Send subscription to server to keep it up-to-date
    setTimeout(async () => {
      if (this.isPermissionGranted) await this.subscribe();
    }, 5 * 1000);
  },

  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },

    async logout() {
      await useAuth().logout(true);
      await this.$router.push({ name: 'login' });
    },

    buildBreadCrumb(module: string, action: string, currentParams: Dictionary, parent?: string) {
      const defaults = { disabled: false, exact: true, link: true };
      const items: Breadcrumbs[] = [];

      if (parent) items.push(...this.buildBreadCrumb(parent, action, currentParams));

      const name = parent ? `${parent}-${module}` : module;
      const title = parent ? `${parent}.${module}` : module;
      const identifier = parent ? `${pluralize.singular(module)}Id` : 'id';
      const { [identifier]: currentId, id } = currentParams;

      const params: Dictionary<string> = { [identifier]: currentId };
      if (parent) params.id = id;

      items.push({ ...defaults, text: this.$t(`${title}.title`).toString(), to: { name } });

      if (!currentId) return items;

      if (currentId === 'create') {
        items.push({
          ...defaults,
          text: this.$t(`${title}.${action}`).toString(),
          to: { name: `${name}-${action}`, params },
        });
        return items;
      }

      const { name: entryName, id: entryId } = this.entry;

      items.push({
        ...defaults,
        text: parent ? this.$t(`${title}.read`) : entryName ?? entryId ?? this.$t(`${title}.read`),
        to: { name: `${name}-read`, params },
      });

      if (['edit'].includes(action)) {
        items.push({
          ...defaults,
          text: this.$t(`${title}.${action}`).toString(),
          to: { name: `${name}-${action}`, params },
        });
      }

      return items;
    },
  },
});
</script>

<style lang="scss">
@import './scss/app.scss';
</style>
