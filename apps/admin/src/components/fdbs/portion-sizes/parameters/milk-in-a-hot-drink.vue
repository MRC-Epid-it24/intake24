<template>
  <v-row>
    <v-col cols="12">
      <language-selector
        v-model="parameters.options"
        :default="[]"
        :label="$t('fdbs.portionSizes.methods.parent-food-portion.options').toString()"
        :required="true"
      >
        <template v-for="lang in Object.keys(parameters.options)" #[`lang.${lang}`]>
          <options-list
            :key="lang"
            :options="parameters.options[lang]"
            :rules="rules"
            @update:options="updateOption(lang, $event)"
          />
        </template>
      </language-selector>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption, PortionSizeParameters } from '@intake24/common/types';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { OptionsList } from '@intake24/admin/components/lists';

import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'MilkInAHotDrinkParameters',

  components: { LanguageSelector, OptionsList },

  props: {
    value: {
      type: Object as PropType<PortionSizeParameters['milk-in-a-hot-drink']>,
      required: true,
    },
  },

  setup(props, context) {
    const { parameters } = useParameters<'milk-in-a-hot-drink'>(props, context);

    const rules = [
      (value: any): boolean | string => {
        const msg = 'Value must be greater than 0';
        const number = Number.parseFloat(value);
        if (Number.isNaN(number))
          return msg;

        return number > 0 || msg;
      },
    ];

    const updateOption = (lang: string, value: ListOption[]) => {
      parameters.value.options[lang] = value.map(item => ({
        ...item,
        value: Number.parseFloat(item.value),
      }));
    };

    return {
      parameters,
      rules,
      updateOption,
    };
  },
});
</script>
