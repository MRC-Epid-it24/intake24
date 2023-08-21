<template>
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
        <v-btn
          :block="isMobile"
          class="mb-6"
          :class="{ 'px-10': !isMobile }"
          color="primary"
          :title="promptI18n.goTo"
          x-large
          @click="redirect"
        >
          <v-icon left>$redirect</v-icon>
          {{ promptI18n.goTo }}
        </v-btn>
      </v-card>
      <v-alert v-else border="left" icon="fas fa-circle-exclamation" outlined type="warning">
        {{ promptI18n.missingUrl }}
      </v-alert>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        large
        outlined
        :to="{ name: 'survey-home', params: { surveyId } }"
      >
        <v-icon left>$home</v-icon>
        {{ $t('common.home') }}
      </v-btn>
      <v-btn
        v-if="showFeedback"
        class="px-4"
        color="primary"
        large
        outlined
        :to="{ name: 'feedback-home', params: { surveyId } }"
      >
        <v-icon left>$feedback</v-icon>
        {{ $t('recall.actions.feedback') }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :to="{ name: 'survey-home', params: { surveyId } }">
        <span class="text-overline font-weight-medium">
          {{ $t('common.home') }}
        </span>
        <v-icon class="pb-1">$home</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn v-if="showFeedback" :to="{ name: 'feedback-home', params: { surveyId } }">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.feedback') }}
        </span>
        <v-icon class="pb-1">$feedback</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn :disabled="!followUpUrl" @click="redirect">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.redirect') }}
        </span>
        <v-icon class="pb-1">$redirect</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'RedirectPrompt',

  mixins: [createBasePrompt<'redirect-prompt'>()],

  props: {
    followUpUrl: {
      type: String,
    },
    showFeedback: {
      type: Boolean,
      default: false,
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
      props.prompt.timer ? Math.round(100 / props.prompt.timer) : 0
    );
    const timerSecs = computed(() =>
      props.prompt.timer ? Math.round((timerValue.value / 100) * props.prompt.timer) : 0
    );

    const promptI18n = computed(() => translatePrompt(['goTo', 'missingUrl']));

    const redirect = () => {
      if (!props.followUpUrl) return;

      window.location.replace(props.followUpUrl);
    };

    const startTimer = () => {
      if (!timerValue.value) return;

      timerInterval.value = setInterval(() => {
        timerValue.value -= timerTick.value;

        if (timerValue.value === 0) {
          clearTimer();
          redirect();
        }
      }, 1000);
    };

    const clearTimer = () => {
      clearInterval(timerInterval.value);
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
      timerSecs,
      timerValue,
      clearTimer,
      redirect,
    };
  },
});
</script>

<style lang="scss" scoped></style>
