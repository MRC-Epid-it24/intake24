<template>
  <v-row>
    <v-col cols="12">
      <v-switch
        v-model="parameters.imageMapLabels"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.milk-on-cereal.imageMapLabels')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PortionSizeParameters } from '@intake24/common/types';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'MilkOnCerealParameters',

  props: {
    value: {
      type: Object as PropType<PortionSizeParameters['milk-on-cereal']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'milk-on-cereal'>(props, context);

    return {
      parameters,
    };
  },
});
</script>
