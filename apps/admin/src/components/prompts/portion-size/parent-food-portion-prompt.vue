<template>
  <div>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :input-value="amountLabel"
            :label="$t('survey-schemes.prompts.parent-food-portion-prompt.amountLabel')"
            @change="update('amountLabel', $event)"
          >
          </v-switch>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            hide-details="auto"
            :items="orientations"
            :label="$t('survey-schemes.prompts.orientation._')"
            outlined
            :value="orientation"
            @change="update('orientation', $event)"
          ></v-select>
        </v-col>
      </v-row>
      <v-card-title>
        {{ $t('survey-schemes.prompts.parent-food-portion-prompt.portions') }}
      </v-card-title>
      <v-tabs vertical>
        <select-resource item-id="code" resource="categories" @input="addCategory">
          <template #activator="{ attrs, on }">
            <v-btn class="mb-4" color="primary" v-bind="attrs" v-on="on">
              <v-icon left>$add</v-icon>
              {{ $t(`fdbs.categories.add`) }}
            </v-btn>
          </template>
          <template #title>{{ $t(`fdbs.categories.title`) }}</template>
          <template #item="{ item }">
            <v-list-item-title>{{ item.code }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
          </template>
        </select-resource>
        <v-tab v-for="(option, key) in items" :key="key">
          <v-icon left>$categories</v-icon>{{ key }}
        </v-tab>
        <v-tab-item v-for="(option, key) in items" :key="key" class="pl-3">
          <div class="d-flex flex-column">
            <language-selector
              v-model="items[key]"
              :default="[]"
              :label="$t('survey-schemes.prompts.parent-food-portion-prompt.portions').toString()"
              :required="true"
            >
              <template v-for="lang in Object.keys(items[key])" #[`lang.${lang}`]>
                <prompt-list-options
                  :key="lang"
                  :options.sync="items[key][lang]"
                  :rules="rules"
                ></prompt-list-options>
              </template>
            </language-selector>
            <v-btn
              class="align-self-end"
              color="error"
              :disabled="key === '_default'"
              text
              @click="removeCategory(key)"
            >
              <v-icon left>$delete</v-icon>{{ $t(`fdbs.categories.remove`) }}
            </v-btn>
          </div>
        </v-tab-item>
      </v-tabs>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { LanguageSelector } from '@intake24/admin/components/forms';

import { basePrompt, PromptListOptions, useSelects } from '../partials';

export default defineComponent({
  name: 'ParentFoodPortionPrompt',

  components: { LanguageSelector, PromptListOptions, SelectResource },

  mixins: [basePrompt],

  props: {
    amountLabel: {
      type: Boolean as PropType<Prompts['parent-food-portion-prompt']['amountLabel']>,
      required: true,
    },
    options: {
      type: Object as PropType<Prompts['parent-food-portion-prompt']['options']>,
      required: true,
    },
    orientation: {
      type: String as PropType<Prompts['parent-food-portion-prompt']['orientation']>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { orientations } = useSelects();
    const items = useVModel(props, 'options', emit);

    const rules = [
      (value: any): boolean | string => {
        const msg = 'Value must be greater than 0';
        const number = Number.parseFloat(value);
        if (Number.isNaN(number)) return msg;

        return number > 0 || msg;
      },
    ];

    const addCategory = (category: string) => {
      items.value = { ...items.value, [category]: { en: [] } };
    };

    const removeCategory = (category: string) => {
      if (category === '_default') return;

      const { [category]: _, ...rest } = items.value;
      items.value = rest;
    };

    return {
      items,
      orientations,
      rules,
      addCategory,
      removeCategory,
    };
  },
});
</script>

<style lang="scss" scoped></style>
