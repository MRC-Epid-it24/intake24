<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.op"
        hide-details="auto"
        item-value="op"
        :items="operationSelectList"
        :label="$t('survey-schemes.conditions.ops._')"
        outlined
        @change="update(currentValue)"
      >
        <template #item="{ item }">
          <v-icon left>
            {{ opToIconMap[item.op] }}
          </v-icon>
          {{ item.text }}
        </template>
        <template #selection="{ item }">
          <v-icon left>
            {{ opToIconMap[item.op] }}
          </v-icon>
          {{ item.text }}
        </template>
      </v-select>
    </v-col>
    <v-col cols="12" md="6">
      <component
        :is="comboOps.includes(currentValue.op) ? 'v-combobox' : 'v-text-field'"
        v-model="currentValue.value"
        hide-details="auto"
        :label="$t('survey-schemes.conditions.value')"
        multiple
        outlined
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import { VCombobox, VTextField } from 'vuetify/lib';

import { type ConditionOpCode, conditionOpCodes, type ValuePropertyCheck } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

import opToIconMap from './op-icon-map';

export default defineComponent({
  name: 'ValuePropertyCheck',

  components: { VTextField, VCombobox },

  props: {
    value: {
      type: Object as PropType<ValuePropertyCheck>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const currentValue = ref(props.value);

    const update = (value: ValuePropertyCheck) => {
      emit('update:value', value);
    };

    const operationSelectList: { op: ConditionOpCode; text: string }[] = conditionOpCodes.map(op => ({
      op,
      text: i18n.t(`survey-schemes.conditions.ops.${op}`).toString(),
    }));

    const comboOps = ['setEq', 'in', 'notIn'];

    return { operationSelectList, update, currentValue, opToIconMap, comboOps };
  },
});
</script>

<style lang="scss" scoped></style>
