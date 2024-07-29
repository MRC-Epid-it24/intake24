<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.completionState"
        hide-details="auto"
        item-value="state"
        :items="completionStateSelectList"
        :label="$t('survey-schemes.conditions.property.foodCompletion')"
        outlined
        @change="update(currentValue)"
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
    value: {
      type: Object as PropType<MealCompletionPropertyCheck>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const currentValue = ref(props.value);

    const completionStateSelectList = foodCompletionStateOptions.map(state => ({ state, text: i18n.t(`survey-schemes.conditions.foodCompletion.${state}`).toString() }));

    const update = (value: MealCompletionPropertyCheck) => {
      emit('update:value', value);
    };
    return { completionStateSelectList, update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
