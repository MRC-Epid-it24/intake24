<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify="center" align-content="center" :no-gutters="isMobile">
      <v-col cols="auto">
        <v-card :class="{ 'mt-10': !isMobile }" :flat="isMobile" :tile="isMobile" max-width="32rem">
          <v-sheet class="d-flex justify-center flex-column" color="deep-orange lighten-5" tile>
            <div class="text-center text-h2 font-weight-medium py-4">
              {{ $t('common.welcome._') }}
            </div>
          </v-sheet>
          <v-card-subtitle class="text-center">
            {{ $t('common.welcome.subtitle') }}
          </v-card-subtitle>
          <v-divider></v-divider>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { defineComponent } from 'vue';
import { surveyService } from '../services';

export default defineComponent({
  name: 'Home',

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
