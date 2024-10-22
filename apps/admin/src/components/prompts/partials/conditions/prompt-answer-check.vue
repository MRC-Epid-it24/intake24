<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="currentValue.promptId"
        hide-details="auto"
        :label="$t('survey-schemes.conditions.promptAnswer.promptId')"
        variant="outlined"
        @change="update(currentValue)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.op"
        hide-details="auto"
        item-value="op"
        :items="conditionOps"
        :label="$t('survey-schemes.conditions.ops._')"
        variant="outlined"
        @update:model-value="update(currentValue)"
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            <template #prepend>
              <v-icon :icon="item.raw.icon" start />
            </template>
            <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
          </v-list-item>
        </template>
        <template #selection="{ item }">
          <v-icon :icon="item.raw.icon" start />
          {{ item.raw.title }}
        </template>
      </v-select>
    </v-col>
    <v-col cols="12">
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
    <v-col cols="12" md="6">
      <v-checkbox v-model="currentValue.required" :label="$t('survey-schemes.conditions.promptAnswer.required')" @update:model-value="update(currentValue)" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import { VCombobox, VTextField } from 'vuetify/components';

import { useSelects } from '@intake24/admin/composables';
import type {
  PromptAnswerPropertyCheck,
} from '@intake24/common/prompts';

export default defineComponent({
  name: 'PromptAnswerPropertyCheck',

  components: { VTextField, VCombobox },

  props: {
    modelValue: {
      type: Object as PropType<PromptAnswerPropertyCheck>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { conditionOps } = useSelects();

    const currentValue = ref(props.modelValue);

    const update = (value: PromptAnswerPropertyCheck) => {
      emit('update:modelValue', value);
    };

    const comboOps = ['setEq', 'in', 'notIn'];

    return { conditionOps, update, currentValue, comboOps };
  },
});
</script>

<style lang="scss" scoped></style>
