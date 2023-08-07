<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" :no-gutters="isMobile">
      <v-col cols="12" md="8" sm="9">
        <v-card v-if="profile" :tile="isMobile">
          <v-list subheader two-line>
            <v-subheader>{{ $t('profile.info') }}</v-subheader>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="primary" dark>fas fa-user</v-icon>
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
                <v-icon class="primary" dark>fa-id-badge</v-icon>
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
                <v-icon class="primary" dark>fa-key</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ $t('profile.providerId') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ profile.subject.providerKey || $t('common.not.provided') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list flat subheader two-line>
            <v-subheader>{{ $t('profile.settings') }}</v-subheader>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon class="primary" dark>fa-language</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-select
                  v-model="language"
                  hide-details="auto"
                  item-text="englishName"
                  item-value="code"
                  :items="languages"
                  :label="$t('profile.languages._')"
                  outlined
                  @change="updateLanguage"
                ></v-select>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <app-info></app-info>
          <v-card-text class="mt-6 d-flex justify-center">
            <confirm-dialog :label="$t('common.logout._').toString()" @confirm="logout">
              <template #activator="{ attrs, on }">
                <v-btn
                  v-bind="attrs"
                  :block="isMobile"
                  class="px-10"
                  color="secondary"
                  outlined
                  x-large
                  v-on="on"
                >
                  <span class="mr-2">{{ $t('common.logout._') }}</span>
                  <v-icon right>$logout</v-icon>
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
import { defineComponent } from 'vue';

import { useAuth, useSurvey, useUser } from '@intake24/survey/stores';
import { AppInfo, ConfirmDialog, setsLanguage } from '@intake24/ui';

export default defineComponent({
  name: 'SurveyUserProfile',

  components: { AppInfo, ConfirmDialog },

  mixins: [setsLanguage],

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState(useUser, ['profile']),
    ...mapState(useSurvey, ['user']),
  },

  methods: {
    async updateLanguage(languageId: string) {
      await this.setLanguage('survey', languageId);
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
