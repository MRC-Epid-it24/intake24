<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="currentValue.flagId"
        hide-details="auto"
        :label="$t('survey-schemes.conditions.flag.id')"
        outlined
        @change="update(currentValue)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-checkbox v-model="currentValue.value" :label="$t('survey-schemes.conditions.flag.showIfSet')" @change="update(currentValue)" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';

import type { FlagPropertyCheck } from '@intake24/common/prompts';

export default defineComponent({
  name: 'FlagPropertyTest',

  props: {
    value: {
      type: Object as PropType<FlagPropertyCheck>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const currentValue = ref(props.value);

    const update = (value: FlagPropertyCheck) => {
      emit('update:value', value);
    };
    return { update, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
