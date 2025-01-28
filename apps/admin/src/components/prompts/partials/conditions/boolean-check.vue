<template>
  <v-row>
    <v-col cols="12">
      <v-checkbox-btn
        v-model="currentValue.value"
        :label="$t('survey-schemes.conditions.showIfTrue')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { BooleanPropertyCheck } from '@intake24/common/prompts';
import { useCheck } from './use-check';

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
    const { currentValue } = useCheck(props, { emit });

    return { currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
