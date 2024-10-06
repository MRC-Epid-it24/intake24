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
        @update:model-value="update(currentValue)"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

import { foodCompletionStateOptions, type MealCompletionPropertyCheck } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

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

    const currentValue = ref(props.modelValue);

    const completionStateSelectList = foodCompletionStateOptions.map(state => ({ state, title: i18n.t(`survey-schemes.conditions.foodCompletion.${state}`) }));

    const update = (value: MealCompletionPropertyCheck) => {
      emit('update:modelValue', value);
    };
    return { completionStateSelectList, update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
