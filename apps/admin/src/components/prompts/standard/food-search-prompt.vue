<template>
  <div>
    <prompt-content
      v-bind="{ name, text, description }"
      @update:description="update('description', $event)"
      @update:name="update('name', $event)"
      @update:text="update('text', $event)"
    ></prompt-content>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
    <v-tab-item key="options">
      <v-row>
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="allowBrowsing"
            :label="$t('survey-schemes.foodSearch.allowBrowsing')"
            @change="update('allowBrowsing', $event)"
          ></v-switch>
        </v-col>
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="dualLanguage"
            :label="$t('survey-schemes.foodSearch.dualLanguage')"
            @change="update('dualLanguage', $event)"
          ></v-switch>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import basePrompt from '../partials/base-prompt';

export default defineComponent({
  name: 'FoodSearchPrompt',

  mixins: [basePrompt],

  props: {
    allowBrowsing: {
      type: Boolean,
      default: true,
    },
    dualLanguage: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped></style>
