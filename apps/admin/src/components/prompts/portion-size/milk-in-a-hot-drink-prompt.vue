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
    <prompt-validation v-bind.sync="validation"></prompt-validation>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12">
          <v-select
            hide-details="auto"
            :items="orientations"
            :label="$t('survey-schemes.questions.orientation._')"
            outlined
            :value="orientation"
            @change="update('orientation', $event)"
          ></v-select>
        </v-col>
      </v-row>
      <language-selector
        :default="[]"
        :label="$t('survey-schemes.questions.options.title').toString()"
        :required="true"
        :value="options"
        @input="update('options', $event)"
      >
        <template v-for="lang in Object.keys(options)" #[`lang.${lang}`]>
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
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { LocaleOptionList } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';

// import selectListPrompt from '../partials/select-list-prompt';
import basePrompt from '../partials/base-prompt';
import PromptListOptions from '../partials/prompt-list-options.vue';

export default defineComponent({
  name: 'MilkInAHotDrink',

  components: { PromptListOptions, LanguageSelector },

  mixins: [basePrompt],

  props: {
    options: {
      type: Object as PropType<LocaleOptionList>,
      required: true,
    },
    orientation: {
      type: String,
      default: 'column',
    },
  },

  data() {
    return {
      orientations: ['column', 'row'].map((value) => ({
        text: this.$t(`survey-schemes.questions.orientation.${value}`),
        value,
      })),
    };
  },
});
</script>

<style lang="scss" scoped></style>
