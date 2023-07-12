<template>
  <v-row>
    <v-col cols="12">
      <select-resource v-model="drinkwareSetId" item-name="id" resource="drinkware-sets">
        <template #activator="{ attrs, on }">
          <v-text-field
            v-bind="attrs"
            hide-details="auto"
            :label="$t('fdbs.portionSizes.methods.drink-scale.drinkwareSet')"
            name="drinkware-set-id"
            outlined
            prepend-inner-icon="$drinkware-sets"
            readonly
            :value="drinkwareSetId"
            v-on="on"
          ></v-text-field>
        </template>
      </select-resource>
    </v-col>
    <v-col cols="12"
      ><v-slider
        v-model="initialFillLevel"
        class="mt-5"
        :label="$t('fdbs.portionSizes.methods.drink-scale.initialLevel')"
        :max="1"
        :min="0"
        :step="0.05"
        thumb-label="always"
      ></v-slider>
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="skipFillLevel"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.drink-scale.skipFillLevelPrompt')"
      ></v-switch>
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="imageMapLabels"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.drink-scale.imageMapLabels')"
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
  name: 'DrinkScaleParameters',

  components: { SelectResource },

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { createBooleanParameter, createNumberParameter, createStringParameter } = useParameters(
      props,
      context
    );

    const drinkwareSetId = createStringParameter('drinkware-id');
    const initialFillLevel = createNumberParameter('initial-fill-level');
    const skipFillLevel = createBooleanParameter('skip-fill-level');
    const imageMapLabels = createBooleanParameter('image-map-labels');

    return {
      drinkwareSetId,
      initialFillLevel,
      skipFillLevel,
      imageMapLabels,
    };
  },
});
</script>
