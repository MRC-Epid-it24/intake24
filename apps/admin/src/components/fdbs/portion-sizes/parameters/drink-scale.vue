<template>
  <v-row>
    <v-col cols="12">
      <select-resource
        v-model="parameters.drinkwareId"
        item-name="description"
        :label="$t('fdbs.portionSizes.methods.drink-scale.drinkwareSet')"
        name="drinkwareSetId"
        resource="drinkware-sets"
      />
    </v-col>
    <v-col cols="12">
      <v-slider
        v-model="parameters.initialFillLevel"
        class="mt-5"
        :label="$t('fdbs.portionSizes.methods.drink-scale.initialLevel')"
        :max="1"
        :min="0"
        :step="0.05"
        thumb-label="always"
      />
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="parameters.skipFillLevel"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.drink-scale.skipFillLevelPrompt')"
      />
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="parameters.imageMapLabels"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.drink-scale.imageMapLabels')"
      />
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="parameters.multiple"
        hide-details="auto"
        :label="$t('fdbs.portionSizes.methods.drink-scale.multiple')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { SelectResource } from '@intake24/admin/components/dialogs';
import type { PortionSizeParameters } from '@intake24/common/surveys';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'DrinkScaleParameters',

  components: { SelectResource },

  props: {
    modelValue: {
      type: Object as PropType<PortionSizeParameters['drink-scale']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'drink-scale'>(props, context);

    return {
      parameters,
    };
  },
});
</script>
