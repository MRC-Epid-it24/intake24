<template>
  <v-app :class="{ mobile: $vuetify.display.mobile }">
    <loader :show="isAppLoading" />
    <v-navigation-drawer v-model="sidebar">
      <template v-if="loggedIn && surveyId">
        <v-list>
          <v-list-item link :to="{ name: 'survey-profile', params: { surveyId } }">
            <template #prepend>
              <v-icon color="info" icon="fas fa-circle-user" size="30" />
            </template>
            <v-list-item-title class="font-weight-medium text-h6">
              {{ userName ?? $t('profile._') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider />
      </template>
      <v-list density="compact" nav>
        <v-list-item
          link
          :to="
            loggedIn && surveyId
              ? { name: 'survey-home', params: { surveyId } }
              : { name: 'home' }
          "
        >
          <template #prepend>
            <v-icon icon="$home" />
          </template>
          <v-list-item-title>{{ $t('common.home') }}</v-list-item-title>
        </v-list-item>
        <template v-if="loggedIn && surveyId">
          <v-list-item
            v-if="recallAllowed"
            link
            :to="{ name: 'survey-recall', params: { surveyId } }"
          >
            <template #prepend>
              <v-icon icon="$survey" />
            </template>
            <v-list-item-title>{{ $t('recall._') }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="feedbackAllowed"
            link
            :to="{ name: 'feedback-home', params: { surveyId } }"
          >
            <template #prepend>
              <v-icon icon="$feedback" />
            </template>
            <v-list-item-title>{{ $t('feedback._') }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
      <template #append>
        <div v-if="loggedIn" class="pa-2">
          <confirm-dialog
            :label="$t('common.logout._')"
            @confirm="logout"
          >
            <template #activator="{ props }">
              <v-btn v-bind="props" block color="grey-darken-2" rounded variant="tonal">
                <v-icon icon="$logout" start />
                <span class="me-2">{{ $t('common.logout._') }}</span>
              </v-btn>
            </template>
            {{ $t('common.logout.text') }}
          </confirm-dialog>
        </div>
        <v-divider />
        <v-list v-if="$vuetify.display.mobile" class="py-0" density="compact">
          <v-list-group>
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                {{ $t('legal._') }}
              </v-list-item>
            </template>
            <v-list-item :href="legal.privacy" link target="_blank">
              <v-list-item-title>
                {{ $t('legal.privacy') }}
              </v-list-item-title>
              <template #append>
                <v-list-item-action>
                  <v-icon icon="$redirect" size="x-small" />
                </v-list-item-action>
              </template>
            </v-list-item>
            <v-list-item :href="legal.terms" link target="_blank">
              <v-list-item-title>
                {{ $t('legal.terms') }}
              </v-list-item-title>
              <template #append>
                <v-list-item-action>
                  <v-icon icon="$redirect" size="x-small" />
                </v-list-item-action>
              </template>
            </v-list-item>
            <v-list-item href="#" link @click.stop="showCookieConsent">
              <v-list-item-title>
                {{ $t('legal.cookies._') }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list>
        <div class="text--secondary text-caption px-4 py-2">
          <v-icon icon="fas fa-tag" size="small" start />
          {{ appInfo.build.fullVersion }}
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="primary" flat scroll-behavior="hide">
      <v-app-bar-nav-icon :title="$t('common.navigation')" @click.stop="toggleSidebar" />
      <template v-if="loggedIn">
        <div v-if="surveyName" class="app-bar-survey-info">
          <i18n-t keypath="recall.survey" tag="span">
            <template #name>
              <span class="font-weight-medium">{{ surveyName }}</span>
            </template>
          </i18n-t>
          <template v-if="recallAllowed">
            <v-divider v-if="$vuetify.display.smAndUp" class="bg-grey mx-4" vertical />
            <i18n-t keypath="recall.submissions.count" tag="span">
              <template #count>
                <span class="font-weight-medium">{{ recallNumber }}</span>
              </template>
            </i18n-t>
          </template>
        </div>
        <v-spacer v-if="$vuetify.display.smAndUp" />
        <v-btn
          v-if="surveyId"
          :icon="$vuetify.display.mobile"
          :size="$vuetify.display.mobile ? 'large' : undefined"
          :title="$t('profile._')"
          :to="{ name: 'survey-profile', params: { surveyId } }"
          :variant="!$vuetify.display.mobile ? 'text' : undefined"
        >
          <span v-if="!$vuetify.display.mobile" class="me-2">{{ $t('profile._') }}</span>
          <v-icon>$profile</v-icon>
        </v-btn>
        <confirm-dialog
          v-if="!$vuetify.display.mobile"
          :label="$t('common.logout._')"
          @confirm="logout"
        >
          <template #activator="{ props }">
            <v-btn variant="text" v-bind="props">
              <span v-if="!$vuetify.display.mobile" class="me-2">{{ $t('common.logout._') }}</span>
              <v-icon end icon="$logout" />
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
    <v-footer v-if="!$vuetify.display.mobile" class="justify-center pa-4 flex-grow-0">
      <div class="d-flex flex-column flex-md-row justify-center align-center text--secondary text-body-2">
        <i18n-t keypath="legal.copyright" tag="span">
          <template #name>
            <a class="text-decoration-none text-primary" :href="legal.home" target="_blank">
              {{ $t('common._') }}
            </a>
          </template>
          <template #team>
            {{ legal.copyright }}
          </template>
          <template #year>
            {{ new Date().getFullYear() }}
          </template>
        </i18n-t>
        <span class="d-none d-md-flex mx-2">|</span>
        <a class="text-decoration-none text-primary" :href="legal.privacy" target="_blank">
          {{ $t('legal.privacy') }}
        </a>
        <span class="d-none d-md-flex mx-2">|</span>
        <a class="text-decoration-none text-primary" :href="legal.terms" target="_blank">
          {{ $t('legal.terms') }}
        </a>
        <span class="d-none d-md-flex mx-2">|</span>
        <a class="text-decoration-none text-primary" href="#" @click="showCookieConsent">
          {{ $t('legal.cookies._') }}
        </a>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useLocale } from 'vuetify';

import { useI18n } from '@intake24/i18n';
import { Navigation } from '@intake24/survey/components/layouts';
import { ConfirmDialog, Loader, MessageBox, ServiceWorker, useCookieConsent, useLanguage } from '@intake24/ui';
import { useHttp } from './services';
import { useApp, useAuth, useSurvey } from './stores';

export default defineComponent({
  name: 'App',

  components: { ConfirmDialog, Loader, MessageBox, Navigation, ServiceWorker },

  setup() {
    const http = useHttp();
    const route = useRoute();
    const vI18n = useLocale();
    const { i18n: { t } } = useI18n();
    useLanguage('survey', http, vI18n);
    const cc = useCookieConsent();

    const sidebar = ref(false);

    const appInfo = computed(() => useApp().app);
    const legal = computed(() => ({
      home: import.meta.env.VITE_LEGAL_HOME,
      copyright: import.meta.env.VITE_LEGAL_COPYRIGHT,
      privacy: import.meta.env.VITE_LEGAL_PRIVACY,
      terms: import.meta.env.VITE_LEGAL_TERMS,
    }));
    const title = computed(() => t(route.meta?.title ?? 'common._'));
    const windowInnerHeight = computed(() => window.innerHeight);

    const showCookieConsent = () => {
      cc.showPreferences();
    };

    watch(route, () => {
      document.title = title.value;
    });

    return {
      appInfo,
      legal,
      showCookieConsent,
      sidebar,
      windowInnerHeight,
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

    showNav(): boolean {
      return this.loggedIn && !!this.surveyId && this.$route.name !== 'survey-recall';
    },
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
@use './scss/app.scss';

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
