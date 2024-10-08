<template>
  <div>
    <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
      <template #actions>
        <v-btn
          class="px-4"
          color="primary"
          size="large"
          :to="{ name: 'survey-home', params: { surveyId } }"
          variant="outlined"
        >
          <v-icon start>
            $home
          </v-icon>
          {{ $t('common.home') }}
        </v-btn>
        <v-btn
          v-if="feedbackEnabled"
          class="px-4"
          color="primary"
          :disabled="!feedbackAvailable"
          size="large"
          :to="{ name: 'feedback-home', params: { surveyId } }"
          variant="outlined"
        >
          <v-icon start>
            $feedback
          </v-icon>
          {{ $t('recall.actions.feedback') }}
        </v-btn>
      </template>
      <template #nav-actions>
        <v-btn color="primary" :to="{ name: 'survey-home', params: { surveyId } }" variant="text">
          <span class="text-overline font-weight-medium">{{ $t('common.home') }}</span>
          <v-icon class="pb-1">
            $home
          </v-icon>
        </v-btn>
        <v-divider vertical />
        <v-btn
          v-if="feedbackEnabled"
          color="primary"
          :disabled="!feedbackAvailable"
          :to="{ name: 'feedback-home', params: { surveyId } }"
          variant="text"
        >
          <span class="text-overline font-weight-medium">
            {{ $t('recall.actions.nav.feedback') }}
          </span>
          <v-icon class="pb-1">
            $feedback
          </v-icon>
        </v-btn>
      </template>
    </card-layout>
    <survey-rating
      v-if="prompt.rating"
      v-bind="{ submissionId, surveyId, type: 'recall' }"
      class="bg-grey-lighten-4 pt-6"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { SurveyRating } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'FinalPrompt',

  components: { SurveyRating },

  mixins: [createBasePrompt<'final-prompt'>()],

  props: {
    feedbackAvailable: {
      type: Boolean,
    },
    feedbackEnabled: {
      type: Boolean,
    },
    submissionId: {
      type: String,
    },
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);

    const isValid = true;

    return { action, isValid };
  },
});
</script>

<style lang="scss" scoped></style>
