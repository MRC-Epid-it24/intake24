<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }">
    <v-card-text class="pt-2 meal-time-prompt">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-time-picker
          :allowed-minutes="allowedMinutes"
          :format="prompt.format"
          full-width
          :landscape="$vuetify.breakpoint.smAndUp"
          :value="currentTime"
          @input="update"
        ></v-time-picker>
      </v-form>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="secondary"
        large
        text
        :title="i18n.no"
        @click.stop="action('cancel')"
      >
        {{ i18n.no }}
      </v-btn>
      <v-btn class="px-4" color="secondary" large :title="i18n.yes" @click.stop="action('next')">
        {{ i18n.yes }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :title="i18n.no" value="cancel" @click.stop="action('cancel')">
        <span class="text-overline font-weight-medium">
          {{ i18n.no }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
        color="secondary"
        :disabled="!isValid"
        :title="i18n.yes"
        value="next"
        @click.stop="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ i18n.yes }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { MealState, MealTime } from '@intake24/common/types';
import { fromMealTime, toMealTime } from '@intake24/common/surveys';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealTimePrompt',

  mixins: [createBasePrompt<'meal-time-prompt'>()],

  props: {
    initialState: {
      type: Object as PropType<MealTime>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { translatePrompt } = usePromptUtils(props);

    const allowedMinutes = computed(
      () => (minutes: number) => minutes % props.prompt.allowedMinutes === 0
    );
    const currentTime = computed(() => fromMealTime(props.initialState, false));

    const i18n = computed(() => translatePrompt(['no', 'yes']));

    const isValid = computed(() => !!currentTime.value);

    const update = (time: string) => {
      emit('update', { state: toMealTime(time) });
    };

    return { allowedMinutes, currentTime, i18n, isValid, update };
  },
});
</script>

<style lang="scss">
.meal-time-prompt {
  .v-time-picker-title {
    justify-content: center;
  }
}
</style>
