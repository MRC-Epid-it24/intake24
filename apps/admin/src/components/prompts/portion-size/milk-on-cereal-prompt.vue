<template>
  <div>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12" md="6">
          <image-map-settings :image-map="imageMap" @update:imageMap="update('imageMap', $event)">
          </image-map-settings>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt, ImageMapSettings } from '../partials';

export default defineComponent({
  name: 'MilkOnCerealPrompt',

  components: { ImageMapSettings },

  mixins: [basePrompt],

  props: {
    imageMap: {
      type: Object as PropType<Prompts['milk-on-cereal-prompt']['imageMap']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
