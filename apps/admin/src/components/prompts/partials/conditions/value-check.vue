<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.op"
        hide-details="auto"
        item-value="op"
        :items="conditionOps"
        :label="$t('survey-schemes.conditions.ops._')"
        variant="outlined"
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props" :title="item.raw.title">
            <template #prepend>
              <v-icon :icon="item.raw.icon" start />
            </template>
          </v-list-item>
        </template>
        <template #selection="{ item }">
          <v-icon :icon="item.raw.icon" start />
          {{ item.raw.title }}
        </template>
      </v-select>
    </v-col>
    <v-col cols="12" md="6">
      <component
        :is="comboOps.includes(currentValue.op) ? 'v-combobox' : 'v-text-field'"
        v-model="currentValue.value"
        chips
        deletable-chips
        hide-details="auto"
        :label="$t('survey-schemes.conditions.value')"
        multiple
        outlined
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { VCombobox, VTextField } from 'vuetify/components';

import type { ValuePropertyCheck } from '@intake24/common/prompts';
import { useCheck } from './use-check';

export default defineComponent({
  name: 'ValuePropertyCheck',

  components: { VTextField, VCombobox },

  props: {
    modelValue: {
      type: Object as PropType<ValuePropertyCheck>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { comboOps, conditionOps, currentValue } = useCheck(props, { emit });

    return { conditionOps, currentValue, comboOps };
  },
});
</script>

<style lang="scss" scoped></style>
