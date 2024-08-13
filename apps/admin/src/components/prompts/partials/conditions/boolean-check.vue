<template>
  <v-row>
    <v-col cols="12">
      <v-checkbox v-model="currentValue.value" :label="$t('survey-schemes.conditions.showIfTrue')" @change="update(currentValue)" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

import type { BooleanPropertyCheck } from '@intake24/common/prompts';

export default defineComponent({
  name: 'BooleanPropertyCheck',

  props: {
    value: {
      type: Object as PropType<BooleanPropertyCheck>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const currentValue = ref(props.value);

    const update = (value: BooleanPropertyCheck) => {
      emit('update:value', value);
    };
    return { update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
