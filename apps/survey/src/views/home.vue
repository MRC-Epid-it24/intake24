<template>
  <v-container :class="{ 'pa-0': $vuetify.display.mobile }">
    <app-entry-screen
      :subtitle="$t('common.welcome.subtitle')"
      :title="$t('common._')"
    >
      <v-divider class="mt-4" />
      <v-card-title class="font-weight-medium">
        {{ $t('survey.openAccess._') }}
      </v-card-title>
      <image-placeholder v-if="isLoading" class="pa-8" />
      <v-list v-else-if="surveys.length">
        <template v-for="(survey, idx) in surveys" :key="survey.id">
          <v-list-item
            :to="{ name: 'survey-login', params: { surveyId: survey.slug } }"
          >
            <template #prepend>
              <v-icon>fas fa-square-poll-vertical</v-icon>
            </template>
            <v-list-item-title>{{ survey.name }}</v-list-item-title>
            <template #append>
              <v-icon>fas fa-arrow-up-right-from-square</v-icon>
            </template>
          </v-list-item>
          <v-divider v-if="idx + 1 < surveys.length" :key="`div-${survey.id}`" />
        </template>
      </v-list>
      <v-list v-else disabled>
        <v-list-item>
          <template #prepend>
            <v-icon>fas fa-ban</v-icon>
          </template>
          <v-list-item-title>{{ $t('survey.openAccess.none._') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('survey.openAccess.none.subtitle') }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </app-entry-screen>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

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
      }
      finally {
        isLoading.value = false;
      }
    };

    const tryLoggingIn = async () => {
      if (!auth.loggedIn)
        await auth.refresh(false);
      if (!auth.loggedIn)
        return;

      const surveyId = useUser().profile?.surveyId;
      if (!surveyId)
        return;

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
