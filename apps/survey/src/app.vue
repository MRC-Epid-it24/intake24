<template>
  <v-app :class="{ mobile: isMobile }">
    <loader :show="isAppLoading" />
    <v-navigation-drawer v-model="sidebar" app>
      <template v-if="loggedIn && surveyId">
        <v-list>
          <v-list-item link :to="{ name: 'survey-profile', params: { surveyId } }">
            <v-list-item-avatar>
              <v-icon color="info" large>fas fa-circle-user</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium text-h6">
                {{ userName ?? $t('profile._') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </template>
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
              <v-icon>$home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('common.home') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <template v-if="loggedIn && surveyId">
            <v-list-item
              v-if="recallAllowed"
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
              v-if="feedbackAllowed"
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
    <v-app-bar app color="primary" dark flat hide-on-scroll>
      <v-app-bar-nav-icon :title="$t('common.navigation')" @click.stop="toggleSidebar">
      </v-app-bar-nav-icon>
      <template v-if="loggedIn">
        <div v-if="surveyName" class="app-bar-survey-info">
          <i18n path="recall.survey" tag="span">
            <template #name>
              <span class="font-weight-medium">{{ surveyName }}</span>
            </template>
          </i18n>
          <template v-if="recallAllowed">
            <v-divider v-if="$vuetify.breakpoint.smAndUp" class="grey mx-4" vertical></v-divider>
            <i18n path="recall.submissions.count" tag="span">
              <template #count>
                <span class="font-weight-medium">{{ recallNumber }}</span>
              </template>
            </i18n>
          </template>
        </div>
        <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
        <v-btn
          v-if="surveyId"
          :icon="isMobile"
          :large="isMobile"
          :text="!isMobile"
          :title="$t('profile._')"
          :to="{ name: 'survey-profile', params: { surveyId } }"
        >
          <span v-if="!isMobile" class="mr-2">{{ $t('profile._') }}</span>
          <v-icon>$profile</v-icon>
        </v-btn>
        <confirm-dialog
          v-if="!isMobile"
          :label="$t('common.logout._').toString()"
          @confirm="logout"
        >
          <template #activator="{ attrs, on }">
            <v-btn text v-bind="attrs" v-on="on">
              <span v-if="!isMobile" class="mr-2">{{ $t('common.logout._') }}</span>
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
    <navigation
      v-if="showNav"
      v-bind="{ surveyId, recall: recallAllowed, feedback: feedbackAllowed }"
    ></navigation>
    <service-worker></service-worker>
    <message-box></message-box>
    <!-- <v-footer app> </v-footer> -->
  </v-app>
</template>

<script lang="ts">
import type { TranslateResult } from 'vue-i18n';
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import { Navigation } from '@intake24/survey/components/layouts';
import { ConfirmDialog, Loader, MessageBox, ServiceWorker, setsLanguage } from '@intake24/ui';

import { useAuth, useSurvey } from './stores';

export default defineComponent({
  name: 'App',

  components: { ConfirmDialog, Loader, MessageBox, Navigation, ServiceWorker },

  mixins: [setsLanguage],

  data() {
    return {
      sidebar: false,
    };
  },

  computed: {
    ...mapState(useAuth, ['loggedIn']),
    ...mapState(useSurvey, {
      feedbackAllowed: 'feedbackAllowed',
      recallAllowed: 'recallAllowed',
      recallNumber: 'recallNumber',
      surveyName: (state) => state.parameters?.name,
      userName: (state) => state.user?.name,
    }),

    surveyId(): string {
      return this.$route.params.surveyId;
    },

    title(): TranslateResult {
      if (this.$route.meta?.title) return this.$t(this.$route.meta.title);

      return this.$t('common._');
    },

    showNav(): boolean {
      return this.loggedIn && !!this.surveyId && this.$route.name !== 'survey-recall';
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

.app-bar-survey-info {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow:
    inset 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);

  display: flex;
  flex-direction: row;
  align-items: center;

  margin-left: 8px;
  padding: 8px 16px 8px 16px;

  span {
    font-size: 0.9rem;
    letter-spacing: 0.167em;
    text-transform: uppercase;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    flex-grow: 1;
    align-items: start;
    justify-content: space-around;

    padding: 0px 16px 0px 16px;

    height: 46px;
    max-height: 46px;
    min-height: 46px;
  }
}

.v-main:has(.bottom-navigation) {
  padding-bottom: 65px !important;
}
</style>
