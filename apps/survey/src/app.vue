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
          <v-list-item v-if="surveyId" :to="{ name: 'survey-recall', params: { surveyId } }" link>
            <v-list-item-action>
              <v-icon>fas fa-fw fa-tachometer-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('recall.dynamic') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="surveyId"
            :to="{ name: 'survey-portion-test', params: { surveyId } }"
            link
          >
            <v-list-item-action>
              <v-icon>fas fa-fw fa-tachometer-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Portions test</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="surveyId" :to="{ name: 'feedback-home', params: { surveyId } }" link>
            <v-list-item-action>
              <v-icon>fas fa-fw fa-tachometer-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('feedback._') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat dark color="secondary" permanent hide-on-scroll>
      <template v-if="loggedIn">
        <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
        <v-img class="mx-2" :src="logo" max-height="30" max-width="150" contain> </v-img>
        <v-spacer></v-spacer>
        <v-btn v-if="surveyId" text :to="{ name: 'survey-profile', params: { surveyId } }">
          <span class="mr-2" v-if="!isNotDesktop">{{ $t('profile._') }}</span>
          <v-icon>$profile</v-icon>
        </v-btn>
        <confirm-dialog :label="$t('common.logout._')" @confirm="logout">
          <template v-slot:activator="{ attrs, on }">
            <v-btn text v-bind="attrs" v-on="on">
              <span class="mr-2" v-if="!isNotDesktop">{{ $t('common.logout._') }}</span>
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
      <router-view></router-view>
    </v-main>
    <service-worker></service-worker>
    <!-- <v-footer app> </v-footer> -->
  </v-app>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { TranslateResult } from 'vue-i18n';
import logo from '@intake24/survey/assets/logo.svg';
import Loader from '@intake24/survey/components/Loader.vue';
import { ConfirmDialog, ServiceWorker, setsLanguage } from '@intake24/ui';
import { useAuth } from './stores';

type Mixins = InstanceType<typeof setsLanguage>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'App',

  components: { ConfirmDialog, Loader, ServiceWorker },

  mixins: [setsLanguage],

  data() {
    return {
      logo,
      sidebar: true,
    };
  },

  computed: {
    ...mapState(useAuth, ['loggedIn']),

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

  async created() {
    await this.setLanguage('survey');
  },

  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },

    async logout() {
      await useAuth().logout(true);
      const { surveyId } = this.$route.params;
      await this.$router.push(
        surveyId ? { name: 'survey-login', params: { surveyId } } : { name: 'home' }
      );
    },
  },
});
</script>

<style lang="scss">
@import './scss/app.scss';
</style>
