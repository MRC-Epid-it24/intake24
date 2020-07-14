<template>
  <div>
    <prompt-content
      :text="text"
      :description="description"
      @update:text="update('text', $event)"
      @update:description="update('description', $event)"
    ></prompt-content>
    <prompt-validation v-bind.sync="validation"></prompt-validation>
    <v-tab-item key="options">
      <v-row>
        <v-col cols="12">
          <div class="text-h6">{{ $t('schemes.questions.options.title') }}</div>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :value="label"
            :label="$t('schemes.questions.label')"
            hide-details="auto"
            outlined
            @input="update('label', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-switch
            :input-value="other"
            :label="$t('schemes.questions.other')"
            hide-details="auto"
            @change="update('other', $event)"
          ></v-switch>
        </v-col>
      </v-row>
      <prompt-list-options
        :options="options"
        @update:options="update('options', $event)"
      ></prompt-list-options>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import selectListPrompt from './partials/SelectListPrompt';

export default Vue.extend({
  name: 'CheckboxListPrompt',

  mixins: [selectListPrompt],
});
</script>

<style lang="scss" scoped></style>
