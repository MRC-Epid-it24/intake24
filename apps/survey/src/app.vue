<template>
  <v-app :class="{ mobile: isMobile }">
    <loader :show="isAppLoading" />
    <v-navigation-drawer v-model="sidebar" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="my-1">{{ $t('common._') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item-group>
          <v-list-item
            link
            :to="
              loggedIn && surveyId
                ? { name: 'survey-home', params: { surveyId } }
                : { name: 'home' }
            "
          >
            <v-list-item-action>
              <v-icon>fas fa-fw fa-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('common.home') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <template v-if="loggedIn && surveyId">
            <v-list-item
              v-if="!limitReached"
              link
              :to="{ name: 'survey-recall', params: { surveyId } }"
            >
              <v-list-item-action>
                <v-icon>$survey</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ $t('recall._') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="feedbackAvailable"
              link
              :to="{ name: 'feedback-home', params: { surveyId } }"
            >
              <v-list-item-action>
                <v-icon>$feedback</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ $t('feedback._') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="secondary" dark flat hide-on-scroll permanent>
      <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
      <template v-if="loggedIn">
        <router-link :to="{ name: 'survey-home', params: { surveyId } }">
          <v-img class="mx-2" contain max-height="30" max-width="150" :src="logo"></v-img>
        </router-link>
        <v-spacer></v-spacer>
        <v-btn v-if="surveyId" text :to="{ name: 'survey-profile', params: { surveyId } }">
          <span v-if="!isNotDesktop" class="mr-2">{{ $t('profile._') }}</span>
          <v-icon>$profile</v-icon>
        </v-btn>
        <confirm-dialog :label="$t('common.logout._').toString()" @confirm="logout">
          <template #activator="{ attrs, on }">
            <v-btn text v-bind="attrs" v-on="on">
              <span v-if="!isNotDesktop" class="mr-2">{{ $t('common.logout._') }}</span>
              <v-icon right>$logout</v-icon>
            </v-btn>
          </template>
          {{ $t('common.logout.text') }}
        </confirm-dialog>
      </template>
      <template v-else>
        <v-app-bar-title>{{ $t('common._') }}</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <service-worker></service-worker>
    <message-box></message-box>
    <!-- <v-footer app> </v-footer> -->
  </v-app>
</template>

<script lang="ts">
import type { TranslateResult } from 'vue-i18n';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import logo from '@intake24/survey/assets/logo.svg';
import Loader from '@intake24/survey/components/Loader.vue';
import { ConfirmDialog, MessageBox, ServiceWorker, setsLanguage } from '@intake24/ui';

import { useAuth, useSurvey } from './stores';

export default defineComponent({
  name: 'App',

  components: { ConfirmDialog, Loader, MessageBox, ServiceWorker },

  mixins: [setsLanguage],

  data() {
    return {
      logo,
      sidebar: false,
    };
  },

  computed: {
    ...mapState(useAuth, ['loggedIn']),
    ...mapState(useSurvey, ['feedbackAvailable', 'limitReached']),

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
      const { surveyId } = this;
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
