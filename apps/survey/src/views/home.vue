<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <app-entry-screen
      :subtitle="$t('common.welcome.subtitle').toString()"
      :title="$t('common._').toString()"
    >
      <v-divider class="mt-4"></v-divider>
      <v-card-title class="font-weight-medium">
        {{ $t('survey.openAccess._') }}
      </v-card-title>
      <image-placeholder v-if="isLoading" class="pa-8"></image-placeholder>
      <v-list v-else-if="surveys.length">
        <template v-for="(survey, idx) in surveys">
          <v-list-item
            :key="survey.id"
            :to="{ name: 'survey-login', params: { surveyId: survey.slug } }"
          >
            <v-list-item-avatar>
              <v-icon>fas fa-square-poll-vertical</v-icon>
            </v-list-item-avatar>
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
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

import type { PublicSurveyEntry } from '@intake24/common/types/http';
import { ImagePlaceholder } from '@intake24/survey/components/elements';
import { AppEntryScreen } from '@intake24/ui/components';

import { surveyService } from '../services';
import { useAuth, useUser } from '../stores';

export default defineComponent({
  name: 'AppHome',

  components: { AppEntryScreen, ImagePlaceholder },

  setup() {
    const isLoading = ref(false);
    const surveys = ref<PublicSurveyEntry[]>([]);
    const auth = useAuth();
    const router = useRouter();

    const fetchSurveyPublicInfo = async () => {
      isLoading.value = true;

      try {
        surveys.value = await surveyService.surveyPublicList();
      } finally {
        isLoading.value = false;
      }
    };

    const tryLoggingIn = async () => {
      if (!auth.loggedIn) await auth.refresh(false);
      if (!auth.loggedIn) return;

      const surveyId = useUser().profile?.surveyId;
      if (!surveyId) return;

      await router.push({ name: 'survey-home', params: { surveyId } });
    };

    onMounted(async () => {
      await tryLoggingIn();
      await fetchSurveyPublicInfo();
    });

    return { isLoading, surveys };
  },
});
</script>
