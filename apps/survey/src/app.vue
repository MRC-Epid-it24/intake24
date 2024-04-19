<template>
  <v-app :class="{ mobile: isMobile }">
    <loader :show="isAppLoading" />
    <v-navigation-drawer v-model="sidebar" app>
      <template v-if="loggedIn && surveyId">
        <v-list>
          <v-list-item link :to="{ name: 'survey-profile', params: { surveyId } }">
            <v-list-item-avatar>
              <v-icon color="info" large>
                fas fa-circle-user
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium text-h6">
                {{ userName ?? $t('profile._') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
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
      <template #append>
        <div v-if="loggedIn" class="pa-2">
          <confirm-dialog
            :label="$t('common.logout._').toString()"
            @confirm="logout"
          >
            <template #activator="{ attrs, on }">
              <v-btn v-bind="attrs" block color="grey darken-2" rounded text v-on="on">
                <v-icon left>
                  $logout
                </v-icon>
                <span class="mr-2">{{ $t('common.logout._') }}</span>
              </v-btn>
            </template>
            {{ $t('common.logout.text') }}
          </confirm-dialog>
        </div>
        <v-divider />
        <v-list v-if="isMobile" class="py-0" dense>
          <v-list-group>
            <template #activator>
              <v-list-item-title>
                {{ $t('common.legal._') }}
              </v-list-item-title>
            </template>
            <v-list-item :href="legal.privacy" link target="_blank">
              <v-list-item-title>
                {{ $t('common.legal.privacy') }}
              </v-list-item-title>
              <v-list-item-action>
                <v-icon small>
                  $redirect
                </v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item :href="legal.terms" link target="_blank">
              <v-list-item-title>
                {{ $t('common.legal.terms') }}
              </v-list-item-title>
              <v-list-item-action>
                <v-icon small>
                  $redirect
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
        </v-list>
        <div class="text--secondary text-caption px-4 py-2">
          <v-icon left small>
            fas fa-tag
          </v-icon>
          {{ appInfo.build.version }} |
          {{ appInfo.build.revision }}
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark flat hide-on-scroll>
      <v-app-bar-nav-icon :title="$t('common.navigation')" @click.stop="toggleSidebar" />
      <template v-if="loggedIn">
        <div v-if="surveyName" class="app-bar-survey-info">
          <i18n path="recall.survey" tag="span">
            <template #name>
              <span class="font-weight-medium">{{ surveyName }}</span>
            </template>
          </i18n>
          <template v-if="recallAllowed">
            <v-divider v-if="$vuetify.breakpoint.smAndUp" class="grey mx-4" vertical />
            <i18n path="recall.submissions.count" tag="span">
              <template #count>
                <span class="font-weight-medium">{{ recallNumber }}</span>
              </template>
            </i18n>
          </template>
        </div>
        <v-spacer v-if="$vuetify.breakpoint.smAndUp" />
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
              <v-icon right>
                $logout
              </v-icon>
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
      <router-view />
    </v-main>
    <navigation
      v-if="showNav"
      v-bind="{ surveyId, recall: recallAllowed, feedback: feedbackAllowed }"
    />
    <service-worker />
    <message-box />
    <v-footer class="justify-center pa-4" color="white">
      <div class="d-flex flex-column flex-md-row justify-center align-center text--secondary text-body-2">
        <i18n path="common.legal.copyright">
          <template #name>
            <a class="text-decoration-none" :href="legal.home" target="_blank">
              {{ $t('common._') }}
            </a>
          </template>
          <template #team>
            {{ legal.copyright }}
          </template>
          <template #year>
            {{ new Date().getFullYear() }}
          </template>
        </i18n>
        <span class="d-none d-md-flex mx-2">|</span>
        <a class="text-decoration-none" :href="legal.privacy" target="_blank">
          {{ $t('common.legal.privacy') }}
        </a>
        <span class="d-none d-md-flex mx-2">|</span>
        <a class="text-decoration-none" :href="legal.terms" target="_blank">
          {{ $t('common.legal.terms') }}
        </a>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import type { TranslateResult } from 'vue-i18n';
import { mapState } from 'pinia';
import { computed, defineComponent, ref } from 'vue';

import { Navigation } from '@intake24/survey/components/layouts';
import { ConfirmDialog, Loader, MessageBox, ServiceWorker, setsLanguage } from '@intake24/ui';

import { useApp, useAuth, useSurvey } from './stores';

export default defineComponent({
  name: 'App',

  components: { ConfirmDialog, Loader, MessageBox, Navigation, ServiceWorker },

  mixins: [setsLanguage],

  setup() {
    const appInfo = computed(() => useApp().app);
    const sidebar = ref(false);

    const legal = computed(() => ({
      home: import.meta.env.VITE_LEGAL_HOME,
      copyright: import.meta.env.VITE_LEGAL_COPYRIGHT,
      privacy: import.meta.env.VITE_LEGAL_PRIVACY,
      terms: import.meta.env.VITE_LEGAL_TERMS,
    }));

    return {
      appInfo,
      legal,
      sidebar,
    };
  },

  computed: {
    ...mapState(useAuth, ['loggedIn']),
    ...mapState(useSurvey, {
      feedbackAllowed: 'feedbackAllowed',
      recallAllowed: 'recallAllowed',
      recallNumber: 'recallNumber',
      surveyName: state => state.parameters?.name,
      userName: state => state.user?.name,
    }),

    surveyId(): string {
      return this.$route.params.surveyId;
    },

    title(): TranslateResult {
      if (this.$route.meta?.title)
        return this.$t(this.$route.meta.title);

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
        surveyId ? { name: 'survey-login', params: { surveyId } } : { name: 'home' },
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
