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

import type { PizzaPromptProps } from '@intake24/common/prompts';

import { basePrompt, ImageMapSettings } from '../partials';

export default defineComponent({
  name: 'PizzaPrompt',

  components: { ImageMapSettings },

  mixins: [basePrompt],

  props: {
    imageMap: {
      type: Object as PropType<PizzaPromptProps['imageMap']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
