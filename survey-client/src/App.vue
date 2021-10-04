<template>
  <v-app>
    <loader :show="isAppLoading" />
    <v-navigation-drawer v-if="loggedIn" v-model="sidebar" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="my-1">{{ $t('common._') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item-group>
          <v-list-item v-if="surveyId" :to="{ name: 'dynamic-recall', params: { surveyId } }" link>
            <v-list-item-action>
              <v-icon>fas fa-fw fa-tachometer-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('recall.dynamic') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ name: 'portion-test', params: { surveyId } }" link>
            <v-list-item-action>
              <v-icon>fas fa-fw fa-tachometer-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Portions test</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark color="secondary" fixed>
      <template v-if="loggedIn">
        <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn text :to="{ name: 'profile', params: { surveyId } }">
          <!-- <span class="mr-2">{{ $t('profile._') }}</span> -->
          <v-icon>$profile</v-icon>
        </v-btn>
        <v-btn text @click.stop="toggleDialog">
          <!-- <span class="mr-2">{{ $t('common.logout') }}</span> -->
          <v-icon>$logout</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-toolbar-title>{{ $t('common._') }}</v-toolbar-title>
      </template>
    </v-app-bar>
    <dialog-window
      :dialog="dialog"
      :title="$t('common.logout')"
      :message="$t('common.logoutMessage')"
      :type="'Logout'"
      @dialog-change="onLogoutDialog"
    ></dialog-window>
    <v-main>
      <v-container :class="{ 'pa-0': isMobile }">
        <!-- <h2 v-if="loggedIn" class="ma-2 text-dark">{{ title }}</h2> -->
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
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import { TranslateResult } from 'vue-i18n';
import Loader from '@/components/Loader.vue';
import pwaUpdate from '@/components/mixins/pwaUpdate';
import DialogWindow from '@/components/elements/DialogWindow.vue';

export interface AppComponent {
  sidebar: boolean;
  toggleSidebar: () => void;
}

export default (Vue as VueConstructor<Vue & AppComponent>).extend({
  name: 'App',

  components: { Loader, DialogWindow },

  mixins: [pwaUpdate],

  data() {
    return {
      sidebar: true,
      dialog: false,
    };
  },

  computed: {
    ...mapGetters('auth', ['loggedIn']),
    surveyId(): string {
      return this.$route.params.surveyId;
    },
    title(): TranslateResult {
      if (this.$route.meta?.title) return this.$t(this.$route.meta.title);

      return this.$t('common._');
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

  async mounted() {
    if (!this.loggedIn && this.$route.name === 'login') {
      try {
        await this.$store.dispatch('auth/refresh');

        const { surveyId } = this.$route.params;
        await this.$router.push({ name: 'dashboard', params: { surveyId } });
      } catch (err) {
        // continue
      }
    }
  },

  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },

    toggleDialog() {
      this.dialog = !this.dialog;
    },

    async onLogoutDialog(value: boolean) {
      this.dialog = !this.dialog;
      if (value) {
        await this.$store.dispatch('auth/logout', { invalidate: true });
        const { surveyId } = this.$route.params;
        await this.$router.push(
          surveyId ? { name: 'login', params: { surveyId } } : { name: 'home' }
        );
      }
    },
  },
});
</script>

<style lang="scss">
@import './scss/app.scss';
</style>
