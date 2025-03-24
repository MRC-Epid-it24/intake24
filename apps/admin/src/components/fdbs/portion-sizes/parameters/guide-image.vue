<template>
  <v-row>
    <v-col cols="12">
      <select-resource
        v-model="parameters.guideImageId"
        item-name="id"
        :label="$t('fdbs.portionSizes.methods.guide-image._')"
        name="guide-image-id"
        resource="guide-images"
      />
    </v-col>
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

import { SelectResource } from '@intake24/admin/components/dialogs';
import type { PortionSizeParameters } from '@intake24/common/surveys';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'GuideImageParameters',

  components: { SelectResource },

  props: {
    modelValue: {
      type: Object as PropType<PortionSizeParameters['guide-image']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'guide-image'>(props, context);

    return {
      parameters,
    };
  },
});
</script>
