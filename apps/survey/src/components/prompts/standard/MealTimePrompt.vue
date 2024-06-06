<template>
  <card-layout
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <v-card-text class="pt-2 meal-time-prompt">
      <v-form @submit.prevent="action('next')">
        <time-picker
          v-if="prompt.timepickerType === 'simple'"
          v-model="state"
          :allowed-minutes="prompt.allowedMinutes"
          :is12-hour-format="prompt.format === 'ampm'"
        />

        <v-time-picker
          v-else
          v-model="state"
          :allowed-minutes="allowedMinutes"
          :format="prompt.format"
          full-width
          :landscape="$vuetify.breakpoint.smAndUp"
        />
      </v-form>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        large
        text
        :title="promptI18n.no"
        @click.stop="action('cancel')"
      >
        {{ promptI18n.no }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        large
        :title="promptI18n.yes"
        @click.stop="action('next')"
      >
        {{ promptI18n.yes }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn
        color="primary"
        text
        :title="promptI18n.no"
        @click.stop="action('cancel')"
      >
        <span class="text-overline font-weight-medium">
          {{ promptI18n.no }}
        </span>
        <v-icon class="pb-1">
          $cancel
        </v-icon>
      </v-btn>
      <v-divider vertical />
      <v-btn
        color="primary"
        :disabled="!isValid"
        :title="promptI18n.yes"
        @click.stop="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ promptI18n.yes }}
        </span>
        <v-icon class="pb-1">
          $next
        </v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';

import type { MealState, MealTime } from '@intake24/common/types';
import { fromMealTime, toMealTime } from '@intake24/common/surveys';
import { usePromptUtils } from '@intake24/survey/composables';

import TimePicker from '../../elements/TimePicker.vue';
import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealTimePrompt',

  components: { TimePicker },

  mixins: [createBasePrompt<'meal-time-prompt'>()],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    value: {
      type: Object as PropType<MealTime>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { action, translatePrompt } = usePromptUtils(props, ctx);

    const selectedTime = ref('12:00');

    const allowedMinutes = computed(
      () => (minutes: number) => minutes % props.prompt.allowedMinutes === 0,
    );
    const promptI18n = computed(() => translatePrompt(['no', 'yes']));
    const state = computed({
      get() {
        return fromMealTime(props.value, false);
      },
      set(value) {
        ctx.emit('input', toMealTime(value));
      },
    });
    const isValid = computed(() => !!state.value);

    watch(
      () => state.value,
      (newState) => {
        console.log(newState);
      },
      { immediate: true },
    );

    return { action, allowedMinutes, selectedTime, isValid, promptI18n, state };
  },
});
</script>

<style lang="scss">
.meal-time-prompt {
  .v-time-picker-title {
    justify-content: center;
  }
}

.vue__time-picker {
  input.display-time {
    border-radius: 0.375rem;
    border: 1px solid #ddd;
    padding: 1.5rem 1rem;
    font-size: 1.5rem;
    color: #444;
    background-color: #fafafa;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #fd7e14;
      box-shadow: 0 0 8px rgba(253, 126, 20, 0.6);
      background-color: #fff;
    }

    &::placeholder {
      color: #bbb;
    }

    &:hover {
      border-color: #fd7e14;
      background-color: #fff;
    }
  }

  .dropdown {
    margin-top: 1.4rem;

    ul {
      li {
        transition:
          background 0.3s,
          color 0.3s;
        border-radius: 0.5rem;
        font-size: 1.2rem;

        &:not([disabled]).active {
          background: #fd7e14;
          color: #fff;
          font-weight: bold;

          &:hover {
            background: rgba(253, 126, 20, 0.9);
          }
        }

        &:hover:not([disabled]) {
          background: #f1f1f1;
          color: #333;
        }
      }
    }
  }
}
</style>
