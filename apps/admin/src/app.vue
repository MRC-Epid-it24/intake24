<template>
  <v-app>
    <loader :show="isAppLoading" />
    <v-navigation-drawer v-if="loggedIn && isVerified" v-model="sidebar" app color="secondary" dark>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="my-1 title">{{ $t('common._') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item-group>
          <v-list-item link :to="{ name: 'dashboard' }">
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
        v-if="
          can([
            'locales',
            'food-groups|browse',
            'nutrient-tables|browse',
            'nutrient-types|browse',
            'nutrient-units|browse',
          ])
        "
        icon="fas fa-fw fa-hamburger"
        name="fdb"
        :resources="resources.fdb"
      ></menu-tree>
      <menu-tree
        v-if="can(['languages', 'locales'])"
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
          can(['feedback-schemes', 'survey-schemes', 'survey-scheme-prompts|browse', 'surveys'])
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

    <v-app-bar v-if="loggedIn" app color="primary" dark fixed>
      <v-app-bar-nav-icon :disabled="!isVerified" @click.stop="toggleSidebar"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn v-if="isVerified" text :to="{ name: 'user' }">
        <span class="mr-2">{{ $t('user._') }}</span>
        <v-icon>$user</v-icon>
      </v-btn>
      <confirm-dialog :label="$t('common.logout._').toString()" @confirm="logout">
        <template #activator="{ attrs, on }">
          <v-btn text v-bind="attrs" v-on="on">
            <span>{{ $t('common.logout._') }}</span>
            <v-icon right>$logout</v-icon>
          </v-btn>
        </template>
        {{ $t('common.logout.text') }}
      </confirm-dialog>
    </v-app-bar>

    <v-main>
      <v-container :class="{ 'pa-0': isMobile }" fluid>
        <v-breadcrumbs v-if="breadcrumbs.length" :items="breadcrumbs" large>
          <template #divider>
            <v-icon>fas fa-caret-right</v-icon>
          </template>
        </v-breadcrumbs>
        <router-view></router-view>
      </v-container>
    </v-main>
    <service-worker></service-worker>
    <message-box></message-box>
    <!-- <v-footer app> </v-footer> -->
  </v-app>
</template>

<script lang="ts">
import type { Location } from 'vue-router';
import groupBy from 'lodash/groupBy';
import { mapState } from 'pinia';
import pluralize from 'pluralize';
import { defineComponent } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import Loader from '@intake24/admin/components/loader.vue';
import MenuTree from '@intake24/admin/components/sidebar/menu-tree.vue';
import webPush from '@intake24/admin/components/web-push/web-push';
import resources from '@intake24/admin/router/resources';
import { useAuth, useEntry, useUser } from '@intake24/admin/stores';
import { ConfirmDialog, MessageBox, ServiceWorker, setsLanguage } from '@intake24/ui';

type Breadcrumbs = {
  disabled?: boolean;
  exact?: boolean;
  href?: string;
  link?: boolean;
  text: string | number;
  to?: string | Location;
};

export default defineComponent({
  name: 'App',

  components: { ConfirmDialog, Loader, MenuTree, MessageBox, ServiceWorker },

  mixins: [setsLanguage, webPush],

  data() {
    return {
      resources: groupBy(resources, 'group'),
      sidebar: this.$vuetify.breakpoint.lgAndUp,
    };
  },

  computed: {
    ...mapState(useAuth, ['loggedIn']),
    ...mapState(useEntry, { entry: 'data' }),
    ...mapState(useUser, ['isVerified']),

    breadcrumbs(): Breadcrumbs[] {
      const { meta: { module, action } = {}, params } = this.$route;
      if (!module || !action) return [];

      const { current, parent } = module;
      return this.buildBreadCrumb(current, action, params, parent);
    },

    title(): string {
      const { meta: { title } = {} } = this.$route;
      if (title) return this.$t(title).toString();

      const { module } = this;
      if (!module) return this.$t('common._').toString();

      const { id, name, englishName, description } = this.entry;

      // TODO: we should resole breadcrumb name in better way based on entry field
      return name ?? englishName ?? description ?? id ?? this.$t(`${module}.title`).toString();
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
    this.$http.init(this.$router, useAuth);

    await this.setLanguage('admin');
  },

  async mounted() {
    if (!this.loggedIn && this.$route.name === 'login') {
      const { state, code } = this.$route.query;

      // MFA verification -> do not refresh yet
      if ([state, code].every((item) => typeof item === 'string' && item.length)) return;

      await useAuth().refresh();
      await this.$router.push({ name: this.isVerified ? 'dashboard' : 'verify' });
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

      // TODO: we should resole breadcrumb name in better way based on entry field
      const {
        id: entryId,
        name: entryName,
        englishName,
        description,
        securables = [],
      } = this.entry;
      const text = entryName ?? englishName ?? description ?? entryId ?? this.$t(`${title}.read`);

      const itemAction =
        this.can(`${module}|read`) || securables.find((item) => item.action === 'read')
          ? 'read'
          : 'edit';

      items.push({
        ...defaults,
        text: parent ? this.$t(`${title}.${itemAction}`) : text,
        to: { name: `${name}-${itemAction}`, params },
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
