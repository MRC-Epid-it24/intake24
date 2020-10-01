<template>
  <v-app>
    <loader :show="isLoading" />
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
              <v-list-item-title>{{ $t('common.dashboard') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <menu-tree
        v-if="can(['languages-list', 'locales-list'])"
        icon="fas fa-fw fa-globe"
        name="local"
        :resources="resources.local"
      ></menu-tree>
      <menu-tree
        v-if="can(['schemes-list', 'surveys-list'])"
        icon="fas fa-fw fa-tools"
        name="surveyMgmt"
        :resources="resources.surveyMgmt"
      ></menu-tree>
      <menu-tree
        v-if="can('acl')"
        icon="fas fa-fw fa-tools"
        name="acl"
        :resources="resources.acl"
      ></menu-tree>
    </v-navigation-drawer>

    <v-app-bar app dark color="secondary" fixed>
      <template v-if="loggedIn">
        <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn text :to="{ name: 'profile' }">
          <span class="mr-2">{{ $t('common.profile') }}</span>
          <v-icon>$profile</v-icon>
        </v-btn>
        <v-btn text @click.stop="onLogout()">
          <span class="mr-2">{{ $t('common.logout') }}</span>
          <v-icon>$logout</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-toolbar-title>{{ $t('common._') }}</v-toolbar-title>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <h1 v-if="loggedIn" class="m-0 text-dark">{{ title }}</h1>
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
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import Loader from './components/Loader.vue';
import MenuTree from './components/sidebar/MenuTree.vue';
import pwaUpdate from './mixins/pwaUpdateMixin';
import resources from './router/resources';

export interface AppComponent {
  sidebar: boolean;
  toggleSidebar: () => void;
}

export default (Vue as VueConstructor<Vue & AppComponent>).extend({
  name: 'App',

  components: { Loader, MenuTree },

  mixins: [pwaUpdate],

  data() {
    return {
      resources: groupBy(resources, 'group'),
      sidebar: true,
    };
  },

  computed: {
    ...mapGetters({ loggedIn: 'auth/loggedIn' }),
    title() {
      if (this.$route.meta.title) return this.$t(this.$route.meta.title);

      return this.$t('common._');
    },
  },

  watch: {
    '$route.meta.module': {
      handler(module) {
        this.$store.commit('module', module);
      },
      deep: true,
      immediate: true,
    },
    title: {
      handler(val) {
        document.title = val;
      },
      immediate: true,
    },
  },

  async mounted() {
    if (!this.loggedIn && this.$route.name === 'login') {
      try {
        await this.$store.dispatch('auth/refresh');
        await this.$router.push({ name: 'dashboard' });
      } catch (err) {
        // continue
      }
    }
  },

  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },

    async onLogout() {
      await this.$store.dispatch('auth/logout');
      await this.$router.push({ name: 'login' });
    },
  },
});
</script>

<style lang="scss">
@import './scss/app.scss';
</style>
