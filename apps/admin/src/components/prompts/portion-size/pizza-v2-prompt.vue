<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12" md="6">
        <image-map-settings :image-map="imageMap" @update:imageMap="update('imageMap', $event)" />
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt, ImageMapSettings } from '../partials';

export default defineComponent({
  name: 'PizzaV2Prompt',

  components: { ImageMapSettings },

  mixins: [basePrompt],

  props: {
    imageMap: {
      type: Object as PropType<Prompts['pizza-v2-prompt']['imageMap']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
