<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.completionState"
        hide-details="auto"
        item-value="state"
        :items="completionStateSelectList"
        :label="$t('survey-schemes.conditions.property.mealCompletion')"
        outlined
        @change="update(currentValue)"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

import { type MealCompletionPropertyCheck, mealCompletionStateOptions } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

export default defineComponent({
  name: 'MealCompletionPropertyCheck',

  props: {
    value: {
      type: Object as PropType<MealCompletionPropertyCheck>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const currentValue = ref(props.value);

    const completionStateSelectList = mealCompletionStateOptions.map(state => ({ state, text: i18n.t(`survey-schemes.conditions.mealCompletion.${state}`).toString() }));

    const update = (value: MealCompletionPropertyCheck) => {
      emit('update:value', value);
    };
    return { completionStateSelectList, update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
