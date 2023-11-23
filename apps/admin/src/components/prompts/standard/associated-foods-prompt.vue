<template>
  <v-tab-item key="options" value="options">
    <v-row>
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :input-value="multiple"
          :label="$t('survey-schemes.prompts.associated-foods-prompt.multiple')"
          @change="update('multiple', $event)"
        ></v-switch>
      </v-col>
      <v-col cols="12" md="6">
        <food-browser-settings
          :categories-first="categoriesFirst"
          @update:categoriesFirst="update('categoriesFirst', $event)"
        >
        </food-browser-settings>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt, FoodBrowserSettings } from '../partials';

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { FoodBrowserSettings },

  mixins: [basePrompt],

  props: {
    categoriesFirst: {
      type: Object as PropType<Prompts['associated-foods-prompt']['categoriesFirst']>,
      required: true,
    },
    multiple: {
      type: Boolean as PropType<Prompts['associated-foods-prompt']['multiple']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
