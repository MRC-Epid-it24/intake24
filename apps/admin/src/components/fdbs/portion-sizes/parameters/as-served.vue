<template>
  <v-row>
    <v-col cols="12">
      <select-resource
        v-model="servingSetId"
        item-name="description"
        :label="$t('fdbs.portionSizes.methods.as-served.servingImageSet')"
        name="serving-set-id"
        resource="as-served-sets"
      >
      </select-resource>
    </v-col>
    <v-col cols="12">
      <select-resource
        v-model="leftoverSetId"
        clearable
        item-name="description"
        :label="$t('fdbs.portionSizes.methods.as-served.leftoverImageSet')"
        resource="as-served-sets"
      >
      </select-resource>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { SelectResource } from '@intake24/admin/components/dialogs';

import type { PortionSizeMethodParameterItem } from '..';
import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'AsServedParameters',

  components: { SelectResource },

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { createStringParameter, removeParameter } = useParameters(props, context);

    const servingSetId = createStringParameter('serving-image-set');
    const leftoverSetId = createStringParameter('leftovers-image-set');

    return {
      servingSetId,
      leftoverSetId,
      removeParameter,
    };
  },
});
</script>
