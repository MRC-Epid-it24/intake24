<template>
  <v-card border flat>
    <v-toolbar color="grey-lighten-4">
      <v-icon icon="$image-maps" start />
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.imageMap._') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-switch
        hide-details="auto"
        :label="$t('survey-schemes.prompts.imageMap.labels')"
        :model-value="imageMap.labels"
        @update:model-value="update('labels', $event)"
      />
      <v-switch
        hide-details="auto"
        :label="$t('survey-schemes.prompts.imageMap.pinchZoom')"
        :model-value="imageMap.pinchZoom"
        @update:model-value="update('pinchZoom', $event)"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ImageMap } from '@intake24/common/prompts';

export default defineComponent({
  name: 'ImageMapSettings',

  props: {
    imageMap: {
      type: Object as PropType<ImageMap>,
      required: true,
    },
  },

  emits: ['update:imageMap'],

  methods: {
    update(field: keyof ImageMap, value: boolean) {
      this.$emit(`update:imageMap`, { ...this.imageMap, [field]: value });
    },
  },
});
</script>

<style lang="scss" scoped></style>
