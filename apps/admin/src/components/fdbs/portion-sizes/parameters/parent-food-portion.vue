<template>
  <v-row>
    <v-col cols="12">
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
        <v-tab v-for="(option, cat) in options" :key="cat">
          <v-icon left>$categories</v-icon>{{ cat }}
        </v-tab>
        <v-tab-item v-for="(option, cat) in options" :key="cat" class="pl-3">
          <div class="d-flex flex-column">
            <language-selector
              v-model="options[cat]"
              :default="[]"
              :label="$t('fdbs.portionSizes.methods.parent-food-portion.options').toString()"
              :required="true"
              @input="setParameter('options', JSON.stringify(options.value))"
            >
              <template v-for="lang in Object.keys(options[cat])" #[`lang.${lang}`]>
                <options-list
                  :key="lang"
                  :options="options[cat][lang]"
                  :rules="rules"
                  @update:options="setOptionParam(cat, lang, $event)"
                ></options-list>
              </template>
            </language-selector>
            <v-btn
              class="align-self-end"
              color="error"
              :disabled="cat === '_default'"
              text
              @click="removeCategory(cat)"
            >
              <v-icon left>$delete</v-icon>{{ $t(`fdbs.categories.remove`) }}
            </v-btn>
          </div>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  CategoryLocaleOptionList,
  ListOption,
  LocaleOptionList,
} from '@intake24/common/prompts';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { OptionsList } from '@intake24/admin/components/lists';

import type { PortionSizeMethodParameterItem } from '..';
import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'ParentFoodPortionParameters',

  components: { LanguageSelector, OptionsList, SelectResource },

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { createObjectParameter, setParameter } = useParameters(props, context);

    const options = createObjectParameter<CategoryLocaleOptionList>('options', {
      _default: { en: [] },
    });

    const rules = [
      (value: any): boolean | string => {
        const msg = 'Value must be greater than 0';
        const number = Number.parseFloat(value);
        if (Number.isNaN(number)) return msg;

        return number > 0 || msg;
      },
    ];

    const addCategory = (category: string) => {
      options.value = { ...options.value, [category]: { en: [] } };
    };

    const removeCategory = (category: string) => {
      if (category === '_default') return;

      const { [category]: _, ...rest } = options.value;
      options.value = rest;
    };

    const setOptionParam = (cat: string, lang: string, value: ListOption[]) => {
      options.value[cat][lang] = [
        ...value.map((item) => ({
          ...item,
          value: Number.parseFloat(item.value),
        })),
      ];
      // TODO: does not run a setter on deep object change
      setParameter('options', JSON.stringify(options.value));
    };

    return {
      addCategory,
      options,
      removeCategory,
      rules,
      setOptionParam,
      setParameter,
    };
  },
});
</script>
