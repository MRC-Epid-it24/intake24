<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-combobox
        v-model="currentValue.field"
        deletable-chips
        hide-details="auto"
        :items="standardUserFields"
        :label="$t('survey-schemes.conditions.userField.field')"
        outlined
        small-chips
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
        outlined
        @change="update(currentValue)"
      >
        <template #item="{ item }">
          <v-icon left>
            {{ item.icon }}
          </v-icon>
          {{ item.text }}
        </template>
        <template #selection="{ item }">
          <v-icon left>
            {{ item.icon }}
          </v-icon>
          {{ item.text }}
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
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import { VCombobox, VTextField } from 'vuetify/lib';

import { useSelects } from '@intake24/admin/composables';
import {
  standardUserFields,
  type UserFieldPropertyCheck,
} from '@intake24/common/prompts';

export default defineComponent({
  name: 'UserFieldPropertyCheck',

  components: { VTextField, VCombobox },

  props: {
    value: {
      type: Object as PropType<UserFieldPropertyCheck>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { conditionOps } = useSelects();

    const currentValue = ref(props.value);

    const update = (value: UserFieldPropertyCheck) => {
      emit('update:value', value);
    };

    const comboOps = ['setEq', 'in', 'notIn'];

    return { conditionOps, update, currentValue, comboOps, standardUserFields };
  },
});
</script>

<style lang="scss" scoped></style>
