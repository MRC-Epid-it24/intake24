<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="currentValue.flagId"
        hide-details="auto"
        :label="$t('survey-schemes.conditions.flag.id')"
        variant="outlined"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-checkbox-btn
        v-model="currentValue.value"
        :label="$t('survey-schemes.conditions.flag.showIfSet')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { FlagPropertyCheck } from '@intake24/common/prompts';
import { useCheck } from './use-check';

export default defineComponent({
  name: 'FlagPropertyCheck',

  props: {
    modelValue: {
      type: Object as PropType<FlagPropertyCheck>,
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
