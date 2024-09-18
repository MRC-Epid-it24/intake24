<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col cols="12" md="8" sm="9">
        <v-card v-if="profile" :tile="isMobile">
          <v-list subheader two-line>
            <v-subheader>{{ $t('profile.info') }}</v-subheader>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="secondary" dark>
                  fas fa-user
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ $t('common.name') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ user?.name || $t('common.not.provided') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="secondary" dark>
                  fas fa-id-badge
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ $t('profile.provider') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ profile.subject.provider || $t('common.not.provided') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="secondary" dark>
                  fas fa-key
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ $t('profile.providerId') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ profile.subject.providerKey || $t('common.not.provided') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider />
          <v-list flat subheader two-line>
            <v-subheader>{{ $t('profile.settings') }}</v-subheader>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="secondary" dark>
                  fas fa-language
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-select
                  hide-details="auto"
                  item-text="englishName"
                  item-value="code"
                  :items="languages"
                  :label="$t('profile.languages._')"
                  outlined
                  :value="language"
                  @change="updateLanguage"
                >
                  <template #item="{ item }">
                    <span :class="`fi fi-${item.countryFlagCode} mr-3`" />
                    {{ item.englishName }}
                  </template>
                  <template #selection="{ item }">
                    <span :class="`fi fi-${item.countryFlagCode} mr-3`" />
                    {{ item.englishName }}
                  </template>
                </v-select>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider />
          <app-info />
          <v-card-text class="mt-6 d-flex justify-center">
            <confirm-dialog :label="$t('common.logout._').toString()" @confirm="logout">
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  :block="isMobile"
                  class="px-10"
                  color="primary"
                  outlined
                  rounded
                  x-large
                  v-on="on"
                >
                  <span class="mr-2">{{ $t('common.logout._') }}</span>
                  <v-icon right>
                    $logout
                  </v-icon>
                </v-btn>
              </template>
              {{ $t('common.logout.text') }}
            </confirm-dialog>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router/composables';

import { useApp, useAuth, useSurvey, useUser } from '@intake24/survey/stores';
import { AppInfo, ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'SurveyUserProfile',

  components: { AppInfo, ConfirmDialog },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const app = useApp();
    const router = useRouter();

    const language = computed(() => app.lang);
    const languages = computed(() => app.availableLanguages);

    const updateLanguage = async (languageId: string) => {
      useApp().setLanguage(languageId);
    };

    const logout = async () => {
      await useAuth().logout(true);
      const { surveyId } = props;
      await router.push(
        surveyId ? { name: 'survey-login', params: { surveyId } } : { name: 'home' },
      );
    };

    return {
      language,
      languages,
      logout,
      updateLanguage,
    };
  },

  computed: {
    ...mapState(useUser, ['profile']),
    ...mapState(useSurvey, ['user']),
  },
});
</script>
