<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <app-entry-screen
      :subtitle="$t('common.welcome.subtitle').toString()"
      :title="$t('common._').toString()"
      width="30rem"
    >
      <v-divider class="mt-4"></v-divider>
      <v-card-title class="font-weight-medium">
        {{ $t('survey.openAccess._') }}
      </v-card-title>
      <v-list v-if="surveys.length">
        <template v-for="(survey, idx) in surveys">
          <v-list-item
            :key="survey.id"
            :to="{ name: 'survey-login', params: { surveyId: survey.slug } }"
          >
            <v-list-item-icon>
              <v-icon>fas fa-square-poll-vertical</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ survey.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>fas fa-arrow-up-right-from-square</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-divider v-if="idx + 1 < surveys.length" :key="`div-${survey.id}`"></v-divider>
        </template>
      </v-list>
      <v-list v-else disabled>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>fas fa-ban</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('survey.openAccess.none._') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ $t('survey.openAccess.none.subtitle') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </app-entry-screen>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { AppEntryScreen } from '@intake24/ui/components';

import { surveyService } from '../services';

export default defineComponent({
  name: 'AppHome',

  components: { AppEntryScreen },

  data() {
    return {
      surveys: [] as PublicSurveyEntry[],
    };
  },

  async mounted() {
    this.surveys = await surveyService.surveyPublicList();
  },
});
</script>
