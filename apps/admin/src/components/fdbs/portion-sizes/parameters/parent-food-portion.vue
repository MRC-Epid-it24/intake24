<template>
  <v-row>
    <v-col cols="12">
      <v-tabs vertical>
        <select-resource item-id="code" resource="categories" @input="addCategory">
          <template #activator="{ attrs, on }">
            <v-btn class="mb-4" color="primary" v-bind="attrs" v-on="on">
              <v-icon left>
                $add
              </v-icon>
              {{ $t(`fdbs.categories.add`) }}
            </v-btn>
          </template>
          <template #title>
            {{ $t(`fdbs.categories.title`) }}
          </template>
          <template #item="{ item }">
            <v-list-item-title>{{ item.code }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
          </template>
        </select-resource>
        <v-tab v-for="(option, cat) in parameters.options" :key="cat">
          <v-icon left>
            $categories
          </v-icon>{{ cat }}
        </v-tab>
        <v-tab-item v-for="(option, cat) in parameters.options" :key="cat" class="pl-3">
          <div class="d-flex flex-column">
            <language-selector
              v-model="parameters.options[cat]"
              :default="[]"
              :label="$t('fdbs.portionSizes.methods.parent-food-portion.options').toString()"
              :required="true"
            >
              <template v-for="lang in Object.keys(parameters.options[cat])" #[`lang.${lang}`]>
                <options-list
                  :key="lang"
                  :options="parameters.options[cat][lang]"
                  :rules="rules"
                  @update:options="updateOption(cat, lang, $event)"
                />
              </template>
            </language-selector>
            <v-btn
              class="align-self-end"
              color="error"
              :disabled="cat === '_default'"
              text
              @click="removeCategory(cat)"
            >
              <v-icon left>
                $delete
              </v-icon>{{ $t(`fdbs.categories.remove`) }}
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

import type { PortionSizeParameters } from '@intake24/common/surveys';
import type { ListOption } from '@intake24/common/types';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { OptionsList } from '@intake24/admin/components/lists';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'ParentFoodPortionParameters',

  components: { LanguageSelector, OptionsList, SelectResource },

  props: {
    value: {
      type: Object as PropType<PortionSizeParameters['parent-food-portion']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'parent-food-portion'>(props, context);

    const rules = [
      (value: any): boolean | string => {
        const msg = 'Value must be greater than 0';
        const number = Number.parseFloat(value);
        if (Number.isNaN(number))
          return msg;

        return number > 0 || msg;
      },
    ];

    const addCategory = (category: string) => {
      parameters.value.options = { ...parameters.value.options, [category]: { en: [] } };
    };

    const removeCategory = (category: string) => {
      if (category === '_default')
        return;

      const { [category]: _, ...rest } = parameters.value.options;
      parameters.value.options = rest;
    };

    const updateOption = (cat: string, lang: string, value: ListOption[]) => {
      parameters.value.options[cat][lang] = [
        ...value.map(item => ({
          ...item,
          value: Number.parseFloat(item.value),
        })),
      ];
    };

    return {
      addCategory,
      removeCategory,
      parameters,
      rules,
      updateOption,
    };
  },
});
</script>
