<template>
  <v-tabs-window-item key="options" value="options">
    <v-row>
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :label="$t('survey-schemes.prompts.associated-foods-prompt.multiple')"
          :model-value="multiple"
          @update:model-value="update('multiple', $event)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <food-browser-settings
          v-bind="{ categoriesFirst, allowThumbnails, enableGrid, gridThreshold }"
          @update="update($event.field, $event.value)"
        />
      </v-col>
    </v-row>
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt, foodBrowserProps, FoodBrowserSettings } from '../partials';

export default defineComponent({
  name: 'AssociatedFoodsPrompt',

  components: { FoodBrowserSettings },

  mixins: [basePrompt, foodBrowserProps],

  props: {
    multiple: {
      type: Boolean as PropType<Prompts['associated-foods-prompt']['multiple']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
