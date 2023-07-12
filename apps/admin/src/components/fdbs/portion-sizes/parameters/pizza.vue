<template>
  <v-row>
    <v-col cols="12">
      <v-switch
        v-model="imageMapLabels"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.pizza.imageMapLabels')"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PortionSizeMethodParameterItem } from '..';
import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'PizzaParameters',

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { createBooleanParameter } = useParameters(props, context);

    const imageMapLabels = createBooleanParameter('image-map-labels');

    return {
      imageMapLabels,
    };
  },
});
</script>
