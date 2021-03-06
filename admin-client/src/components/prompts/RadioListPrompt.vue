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
          <v-select
            :value="orientation"
            :items="orientations"
            :label="$t('schemes.questions.orientation._')"
            hide-details="auto"
            outlined
            @change="update('orientation', $event)"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-switch
            :input-value="other"
            :label="$t('schemes.questions.other')"
            hide-details="auto"
            @change="update('other', $event)"
          ></v-switch>
        </v-col>
        <v-col cols="12">
          <language-selector
            :default="[]"
            :label="$t('schemes.questions.label')"
            :value="label"
            @input="update('label', $event)"
          >
            <template v-for="lang in Object.keys(label)" v-slot:[`lang.${lang}`]>
              <v-text-field
                :label="$t('schemes.questions.label')"
                :key="lang"
                :value="label[lang]"
                hide-details="auto"
                outlined
                @input="updateLanguage('label', lang, $event)"
              ></v-text-field>
            </template>
          </language-selector>
        </v-col>
      </v-row>
      <language-selector
        :default="[]"
        :label="$t('schemes.questions.options.title')"
        :value="options"
        @input="update('options', $event)"
      >
        <template v-for="lang in Object.keys(options)" v-slot:[`lang.${lang}`]>
          <prompt-list-options
            :key="lang"
            :options="options[lang]"
            @update:options="updateLanguage('options', lang, $event)"
          ></prompt-list-options>
        </template>
      </language-selector>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import selectListPrompt from './partials/SelectListPrompt';

export default Vue.extend({
  name: 'RadioListPrompt',

  mixins: [selectListPrompt],

  props: {
    orientation: {
      type: String,
      default: 'column',
    },
  },

  data() {
    return {
      orientations: [
        { text: this.$t('schemes.questions.orientation.column'), value: 'column' },
        { text: this.$t('schemes.questions.orientation.row'), value: 'row' },
      ],
    };
  },
});
</script>

<style lang="scss" scoped></style>
