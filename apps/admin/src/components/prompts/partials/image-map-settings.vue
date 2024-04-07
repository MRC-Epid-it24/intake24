<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-icon left>
        $image-maps
      </v-icon>
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.imageMap._') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-switch
        hide-details="auto"
        :input-value="imageMap.labels"
        :label="$t('survey-schemes.prompts.imageMap.labels')"
        @change="update('labels', $event)"
      />
      <v-switch
        hide-details="auto"
        :input-value="imageMap.pinchZoom"
        :label="$t('survey-schemes.prompts.imageMap.pinchZoom')"
        @change="update('pinchZoom', $event)"
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
