<template>
  <v-tab-item key="options" value="options">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.general-associated-foods-prompt.categoryCode')"
            :value="categoryCode"
            @change="update('categoryCode', $event)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <language-selector
            :default="[]"
            :label="$t('survey-schemes.prompts.general-associated-foods-prompt.promptText').toString()"
            :value="promptText"
            @input="update('promptText', $event)"
          >
            <template v-for="lang in Object.keys(promptText)" #[`lang.${lang}`]>
              <v-text-field
                :key="lang"
                hide-details="auto"
                :name="`promptText.${lang}`"
                outlined
                :value="promptText[lang]"
                @input="updateLanguage('promptText', lang, $event)"
              />
            </template>
          </language-selector>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <language-selector
            :default="[]"
            :label="$t('survey-schemes.prompts.general-associated-foods-prompt.genericName').toString()"
            :value="genericName"
            @input="update('genericName', $event)"
          >
            <template v-for="lang in Object.keys(genericName)" #[`lang.${lang}`]>
              <v-text-field
                :key="lang"
                hide-details="auto"
                :name="`genericName.${lang}`"
                outlined
                :value="genericName[lang]"
                @input="updateLanguage('genericName', lang, $event)"
              />
            </template>
          </language-selector>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :input-value="multiple"
            :label="$t('survey-schemes.prompts.general-associated-foods-prompt.multiple')"
            @change="update('multiple', $event)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :input-value="skipPortionSize"
            :label="$t('survey-schemes.prompts.general-associated-foods-prompt.skipPortionSize')"
            @change="update('skipPortionSize', $event)"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <food-browser-settings
            :categories-first="categoriesFirst"
            @update:categoriesFirst="update('categoriesFirst', $event)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { LanguageSelector } from '../../forms';
import { basePrompt, FoodBrowserSettings } from '../partials';

export default defineComponent({
  name: 'GeneralAssociatedFoodsPrompt',

  components: { FoodBrowserSettings, LanguageSelector },

  mixins: [basePrompt],

  props: {
    categoryCode: {
      type: String as PropType<Prompts['general-associated-foods-prompt']['categoryCode']>,
      required: true,
    },
    promptText: {
      type: Object as PropType<Prompts['general-associated-foods-prompt']['promptText']>,
      required: true,
    },
    genericName: {
      type: Object as PropType<Prompts['general-associated-foods-prompt']['genericName']>,
      required: true,
    },
    categoriesFirst: {
      type: Object as PropType<Prompts['general-associated-foods-prompt']['categoriesFirst']>,
      required: true,
    },
    multiple: {
      type: Boolean as PropType<Prompts['general-associated-foods-prompt']['multiple']>,
      required: true,
    },
    skipPortionSize: {
      type: Boolean as PropType<Prompts['general-associated-foods-prompt']['skipPortionSize']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
