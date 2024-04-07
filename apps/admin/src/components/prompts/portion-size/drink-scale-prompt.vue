<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :input-value="badges"
          :label="$t('survey-schemes.prompts.badges')"
          @change="update('badges', $event)"
        />
        <v-switch
          hide-details="auto"
          :input-value="leftovers"
          :label="$t('survey-schemes.prompts.leftovers')"
          @change="update('leftovers', $event)"
        />
        <v-switch
          hide-details="auto"
          :input-value="multiple"
          :label="$t('survey-schemes.prompts.drink-scale-prompt.multiple')"
          @change="updateMultiple($event)"
        />
        <slider-settings
          v-if="multiple"
          class="mt-4"
          :model-value="multiple"
          @update:model-value="update('multiple', $event)"
        />
      </v-col>
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
import { drinkScalePrompt } from '@intake24/common/prompts';

import { basePrompt, ImageMapSettings, SliderSettings } from '../partials';

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: { ImageMapSettings, SliderSettings },

  mixins: [basePrompt],

  props: {
    badges: {
      type: Boolean as PropType<Prompts['drink-scale-prompt']['badges']>,
      required: true,
    },
    imageMap: {
      type: Object as PropType<Prompts['drink-scale-prompt']['imageMap']>,
      required: true,
    },
    leftovers: {
      type: Boolean as PropType<Prompts['drink-scale-prompt']['leftovers']>,
      required: true,
    },
    multiple: {
      type: [Boolean, Object] as PropType<Prompts['drink-scale-prompt']['multiple']>,
      required: true,
    },
  },

  setup() {
    return { drinkScalePrompt };
  },

  methods: {
    updateMultiple(value: boolean) {
      this.update('multiple', value ? this.drinkScalePrompt.multiple : false);
    },
  },
});
</script>

<style lang="scss" scoped></style>
