<template>
  <div>
    <prompt-content
      v-bind="{ name, text, description }"
      @update:description="update('description', $event)"
      @update:name="update('name', $event)"
      @update:text="update('text', $event)"
    ></prompt-content>
    <prompt-actions :actions="actions" @update:actions="update('actions', $event)"></prompt-actions>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
    <v-tab-item key="options">
      <image-map-settings :image-map="imageMap" @update:imageMap="update('imageMap', $event)">
      </image-map-settings>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DrinkScalePromptProps } from '@intake24/common/prompts';

import { basePrompt, ImageMapSettings } from '../partials';

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: { ImageMapSettings },

  mixins: [basePrompt],

  props: {
    imageMap: {
      type: Object as PropType<DrinkScalePromptProps['imageMap']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
