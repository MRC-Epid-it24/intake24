<template>
  <v-card outlined>
    <v-toolbar flat>
      <v-icon left>$image-maps</v-icon>
      <v-toolbar-title>
        {{ $t('survey-schemes.questions.imageMap._') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-switch
        hide-details="auto"
        :input-value="imageMap.labels"
        :label="$t('survey-schemes.questions.imageMap.labels')"
        @change="update('labels', $event)"
      ></v-switch>
      <v-switch
        hide-details="auto"
        :input-value="imageMap.pinchZoom"
        :label="$t('survey-schemes.questions.imageMap.pinchZoom')"
        @change="update('pinchZoom', $event)"
      ></v-switch>
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
