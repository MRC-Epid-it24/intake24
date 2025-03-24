<template>
  <v-row>
    <v-col cols="12">
      <v-switch
        v-model="parameters.labels"
        :label="$t('fdbs.portionSizes.labels')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PortionSizeParameters } from '@intake24/common/surveys';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'PizzaParameters',

  props: {
    modelValue: {
      type: Object as PropType<PortionSizeParameters['pizza']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'pizza'>(props, context);

    return {
      parameters,
    };
  },
});
</script>
