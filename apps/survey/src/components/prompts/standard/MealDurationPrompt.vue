<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }">
    <v-card-text class="pt-2">
      <v-form ref="form" @submit.prevent="action('next')">
        <v-slider
          class="meal-duration-slider px-8"
          color="grey darken-1"
          :max="prompt.max"
          :min="prompt.min"
          :step="prompt.step"
          thumb-label="always"
          :thumb-size="75"
          :value="initialState"
          @input="update"
        >
          <template #thumb-label="{ value }">
            <div class="d-flex flex-column align-center">
              <span class="text-h5 font-weight-bold">{{ value }}</span>
              <span class="text-h6 font-weight-bold">{{ i18n.minutes }}</span>
            </div>
          </template>
        </v-slider>
      </v-form>
    </v-card-text>
    <template #actions>
      <v-btn class="px-4" color="secondary" large @click.stop="action('next')">
        {{ i18n.confirm }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="secondary" :disabled="!isValid" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.next') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealDurationPrompt',

  mixins: [createBasePrompt<'meal-duration-prompt'>()],

  props: {
    initialState: {
      type: Number,
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

    const i18n = computed(() => translatePrompt(['minutes', 'confirm']));

    const isValid = computed(() => props.initialState !== null);

    const update = (duration: string) => {
      emit('update', { state: duration });
    };

    return { i18n, isValid, update };
  },
});
</script>

<style lang="scss" scoped>
.meal-duration-slider {
  padding-top: 85px;
}
</style>
