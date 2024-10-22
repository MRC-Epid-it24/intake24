<template>
  <v-row>
    <v-col cols="12">
      <select-resource
        v-model="parameters.servingImageSet"
        item-name="description"
        :label="$t('fdbs.portionSizes.methods.as-served.servingImageSet')"
        name="serving-set-id"
        resource="as-served-sets"
      />
    </v-col>
    <v-col cols="12">
      <select-resource
        v-model="parameters.leftoversImageSet"
        clearable
        item-name="description"
        :label="$t('fdbs.portionSizes.methods.as-served.leftoverImageSet')"
        resource="as-served-sets"
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
  name: 'AsServedParameters',

  components: { SelectResource },

  props: {
    modelValue: {
      type: Object as PropType<PortionSizeParameters['as-served']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'as-served'>(props, context);

    return {
      parameters,
    };
  },
});
</script>
