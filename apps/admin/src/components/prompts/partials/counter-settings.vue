<template>
  <v-card border flat>
    <v-toolbar color="grey-lighten-4">
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
              v-model.number="modelValue.current"
              hide-details="auto"
              :label="$t('survey-schemes.prompts.counter.current')"
              name="current"
              :rules="isNumber"
              variant="outlined"
            />
            <v-text-field
              v-model.number="modelValue.min"
              class="mt-4"
              hide-details="auto"
              :label="$t('survey-schemes.prompts.counter.min')"
              name="min"
              :rules="isNumber"
              variant="outlined"
            />
            <v-text-field
              v-model.number="modelValue.max"
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
            v-model="modelValue.confirm"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.counter.confirm')"
          />
          <v-switch
            v-model="modelValue.whole"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.counter.whole')"
          />
          <v-switch
            v-model="modelValue.fraction"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.counter.fraction')"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';

import { computed } from 'vue';
import type { Counter } from '@intake24/common/prompts';

defineOptions({ name: 'CounterSettings' });

const props = defineProps({
  modelValue: {
    type: Object as PropType<Counter>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const modelValue = useVModel(props, 'modelValue', emit, { deep: true, passive: true });

const isNumber = computed(() => [
  (value: string | null): boolean | string =>
    !Number.isNaN(value) || 'Value needs to be a number.',
]);
</script>

<style lang="scss" scoped></style>
