<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="servingSetId" item-name="id" resource="as-served-sets">
        <template #activator="{ attrs, on }">
          <v-text-field
            v-bind="attrs"
            hide-details="auto"
            :label="$t('fdbs.portionSizes.methods.as-served.servingImageSet')"
            name="serving-set-id"
            outlined
            prepend-inner-icon="fas fa-image"
            readonly
            :value="servingSetId"
            v-on="on"
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
    <v-col cols="12">
      <select-resource v-model="leftoverSetId" item-name="id" resource="as-served-sets">
        <template #activator="{ attrs, on }">
          <v-text-field
            v-bind="attrs"
            clearable
            hide-details="auto"
            item-name="description"
            :label="$t('fdbs.portionSizes.methods.as-served.leftoverImageSet')"
            list-name="id"
            name="leftover-set-id"
            outlined
            prepend-inner-icon="fas fa-image"
            readonly
            :value="leftoverSetId"
            v-on="on"
            @click:clear="removeParameter('leftovers-image-set')"
          ></v-text-field>
        </template>
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
