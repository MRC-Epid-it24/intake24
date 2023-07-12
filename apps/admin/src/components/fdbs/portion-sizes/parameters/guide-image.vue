<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="guideImageId" item-name="id" resource="guide-images">
        <template #activator="{ attrs, on }">
          <v-text-field
            v-bind="attrs"
            hide-details="auto"
            :label="$t('fdbs.portionSizes.methods.guide-image._')"
            name="guide-image-id"
            outlined
            prepend-inner-icon="fas fa-image"
            readonly
            :value="guideImageId"
            v-on="on"
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="imageMapLabels"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.guide-image.imageMapLabels')"
      ></v-switch>
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
  name: 'GuideImageParameters',

  components: { SelectResource },

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { createBooleanParameter, createStringParameter } = useParameters(props, context);

    const guideImageId = createStringParameter('guide-image-id');
    const imageMapLabels = createBooleanParameter('image-map-labels');

    return {
      guideImageId,
      imageMapLabels,
    };
  },
});
</script>
