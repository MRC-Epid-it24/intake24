<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.completionState"
        hide-details="auto"
        item-value="state"
        :items="completionStateSelectList"
        :label="$t('survey-schemes.conditions.property.foodCompletion')"
        variant="outlined"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import { foodCompletionStateOptions, type MealCompletionPropertyCheck } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';
import { useCheck } from './use-check';

export default defineComponent({
  name: 'FoodCompletionPropertyCheck',

  props: {
    modelValue: {
      type: Object as PropType<MealCompletionPropertyCheck>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const { currentValue } = useCheck(props, { emit });

    const completionStateSelectList = foodCompletionStateOptions.map(state => ({ state, title: i18n.t(`survey-schemes.conditions.foodCompletion.${state}`) }));

    return { completionStateSelectList, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
