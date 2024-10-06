<template>
  <v-card border>
    <v-toolbar color="grey-lighten-4" flat>
      <v-icon icon="fas fa-calculator" start />
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.counter.title') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-text>
            <v-text-field
              v-model.number="counter.current"
              hide-details="auto"
              :label="$t('survey-schemes.prompts.counter.current')"
              name="current"
              :rules="isNumber"
              variant="outlined"
            />
            <v-text-field
              v-model.number="counter.min"
              class="mt-4"
              hide-details="auto"
              :label="$t('survey-schemes.prompts.counter.min')"
              name="min"
              :rules="isNumber"
              variant="outlined"
            />
            <v-text-field
              v-model.number="counter.max"
              class="mt-4"
              hide-details="auto"
              :label="$t('survey-schemes.prompts.counter.max')"
              name="max"
              :rules="isNumber"
              variant="outlined"
            />
          </v-card-text>
        </v-col>
        <v-col cols="12" md="6">
          <v-switch
            v-model="counter.confirm"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.counter.confirm')"
          />
          <v-switch
            v-model="counter.whole"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.counter.whole')"
          />
          <v-switch
            v-model="counter.fraction"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.counter.fraction')"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Counter } from '@intake24/common/prompts';

export default defineComponent({
  name: 'CounterSettings',

  props: {
    modelValue: {
      type: Object as PropType<Counter>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const isNumber = computed(() => [
      (value: string | null): boolean | string =>
        !Number.isNaN(value) || 'Value needs to be a number.',
    ]);

    const counter = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    return { counter, isNumber };
  },
});
</script>

<style lang="scss" scoped></style>
