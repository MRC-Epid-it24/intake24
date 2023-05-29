<template>
  <div>
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
            :rules="rules"
            @update:options="updateOptions(lang, $event)"
          ></prompt-list-options>
        </template>
      </language-selector>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption, Prompts } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';

import { basePrompt } from '../partials';
import PromptListOptions from '../partials/prompt-list-options.vue';

export default defineComponent({
  name: 'MilkInAHotDrinkPrompt',

  components: { PromptListOptions, LanguageSelector },

  mixins: [basePrompt],

  props: {
    options: {
      type: Object as PropType<Prompts['milk-in-a-hot-drink-prompt']['options']>,
      required: true,
    },
    orientation: {
      type: String as PropType<Prompts['milk-in-a-hot-drink-prompt']['orientation']>,
      required: true,
    },
  },

  data() {
    return {
      orientations: ['column', 'row'].map((value) => ({
        text: this.$t(`survey-schemes.questions.orientation.${value}`),
        value,
      })),
      rules: [
        (value: any): boolean | string => {
          const msg = 'Value must be between 0 and 1';
          const number = Number.parseFloat(value);
          if (Number.isNaN(number)) return msg;

          return (number > 0 && number < 1) || msg;
        },
      ],
    };
  },

  methods: {
    updateOptions(lang: string, options: ListOption[]) {
      this.updateLanguage(
        'options',
        lang,
        options.map((item) => ({ ...item, value: Number.parseFloat(item.value) }))
      );
    },
  },
});
</script>

<style lang="scss" scoped></style>
