<template>
  <v-row>
    <v-col cols="12">
      <v-checkbox-btn v-model="currentValue.value" :label="$t('survey-schemes.conditions.showIfTrue')" @update:model-value="update(currentValue)" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

import type { BooleanPropertyCheck } from '@intake24/common/prompts';

export default defineComponent({
  name: 'BooleanPropertyCheck',

  props: {
    modelValue: {
      type: Object as PropType<BooleanPropertyCheck>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const currentValue = ref(props.modelValue);

    const update = (value: BooleanPropertyCheck) => {
      emit('update:modelValue', value);
    };
    return { update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
