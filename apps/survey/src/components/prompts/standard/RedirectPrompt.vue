<template>
  <div>
    <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
      <v-card-text class="pt-2">
        <v-card v-if="followUpUrl" class="d-flex flex-column align-center" flat tile>
          <v-progress-circular
            v-if="prompt.timer"
            class="mb-6"
            color="secondary"
            :rotate="-90"
            :size="200"
            :value="timerValue"
            :width="20"
          >
            <div class="d-flex align-center flex-column">
              <span class="font-weight-bold text-h1">{{ timerSecs }}</span>
            </div>
          </v-progress-circular>
        </v-card>
      </v-card-text>
      <template #actions>
        <v-btn
          class="px-4"
          color="secondary"
          large
          outlined
          :to="{ name: 'survey-home', params: { surveyId } }"
        >
          <v-icon left>
            $home
          </v-icon>
          {{ $t('common.home') }}
        </v-btn>
        <v-btn
          v-if="feedbackEnabled"
          class="px-4"
          color="primary"
          :disabled="!feedbackAvailable"
          large
          outlined
          :to="{ name: 'feedback-home', params: { surveyId } }"
        >
          <v-icon left>
            $feedback
          </v-icon>
          {{ $t('recall.actions.feedback') }}
        </v-btn>
        <template v-if="followUpUrl">
          <v-spacer />
          <v-btn
            class="px-4"
            color="primary"
            :href="followUpUrl"
            large
            outlined
            :target="prompt.target"
            :title="promptI18n.goTo"
          >
            <v-icon left>
              $redirect
            </v-icon>
            {{ promptI18n.goTo }}
          </v-btn>
        </template>
      </template>
      <template #nav-actions>
        <v-btn :to="{ name: 'survey-home', params: { surveyId } }">
          <span class="text-overline font-weight-medium">
            {{ $t('common.home') }}
          </span>
          <v-icon class="pb-1">
            $home
          </v-icon>
        </v-btn>
        <v-divider vertical />
        <v-btn
          v-if="feedbackEnabled"
          color="primary"
          :disabled="!feedbackAvailable"
          text
          :to="{ name: 'feedback-home', params: { surveyId } }"
        >
          <span class="text-overline font-weight-medium">
            {{ $t('recall.actions.nav.feedback') }}
          </span>
          <v-icon class="pb-1">
            $feedback
          </v-icon>
        </v-btn>
        <v-divider vertical />
        <v-btn v-if="followUpUrl" color="primary" :href="followUpUrl" :target="prompt.target" text>
          <span class="text-overline font-weight-medium">
            {{ promptI18n.goTo }}
          </span>
          <v-icon class="pb-1">
            $redirect
          </v-icon>
        </v-btn>
      </template>
    </card-layout>
    <survey-rating
      v-if="prompt.rating"
      v-bind="{ submissionId, surveyId, type: 'recall' }"
      class="grey lighten-4 pt-6"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import { SurveyRating } from '@intake24/survey/components';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'RedirectPrompt',

  components: { SurveyRating },

  mixins: [createBasePrompt<'redirect-prompt'>()],

  props: {
    feedbackAvailable: {
      type: Boolean,
    },
    feedbackEnabled: {
      type: Boolean,
    },
    followUpUrl: {
      type: String,
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
    const { action, translatePrompt } = usePromptUtils(props, ctx);

    const isValid = true;
    const timerInterval = ref<undefined | number>(undefined);
    const timerValue = ref(props.prompt.timer ? 100 : 0);
    const timerTick = computed(() =>
      props.prompt.timer ? Math.round(100 / props.prompt.timer) : 0,
    );
    const timerSecs = computed(() => {
      if (!props.prompt.timer)
        return 0;

      const timer = Math.round((timerValue.value / 100) * props.prompt.timer);
      return timer > 0 ? timer : 0;
    });

    const promptI18n = computed(() => translatePrompt(['goTo', 'missingUrl']));

    const redirect = () => {
      if (!props.followUpUrl)
        return;

      window.open(props.followUpUrl, props.prompt.target);
    };

    const clearTimer = () => {
      clearInterval(timerInterval.value);
    };

    const startTimer = () => {
      if (!timerValue.value || !props.followUpUrl)
        return;

      timerInterval.value = setInterval(() => {
        timerValue.value -= timerTick.value;

        if (timerValue.value <= 0) {
          clearTimer();
          redirect();
        }
      }, 1000);
    };

    onMounted(() => {
      startTimer();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    return {
      action,
      isValid,
      promptI18n,
      timerTick,
      timerSecs,
      timerValue,
      clearTimer,
      redirect,
    };
  },
});
</script>

<style lang="scss" scoped></style>
