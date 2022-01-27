<template>
  <div>
    <prompt-content
      :text="text"
      :description="description"
      :text-required="false"
      @update:text="update('text', $event)"
      @update:description="update('description', $event)"
    ></prompt-content>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
    <v-tab-item key="options">
      <v-row>
        <v-col cols="12">
          <v-switch
            :input-value="allowBrowsing"
            :label="$t('survey-schemes.foodSearch.allowBrowsing')"
            hide-details="auto"
            @change="update('allowBrowsing', $event)"
          ></v-switch>
        </v-col>
        <v-col cols="12">
          <v-switch
            :input-value="dualLanguage"
            :label="$t('survey-schemes.foodSearch.dualLanguage')"
            hide-details="auto"
            @change="update('dualLanguage', $event)"
          ></v-switch>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import basePrompt from '../partials/base-prompt';

export default Vue.extend({
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
