<template>
  <v-row>
    <v-col cols="12">
      <language-selector
        v-model="options"
        :default="[]"
        :label="$t('fdbs.portionSizes.methods.parent-food-portion.options').toString()"
        :required="true"
      >
        <template v-for="lang in Object.keys(options)" #[`lang.${lang}`]>
          <options-list
            :key="lang"
            :options="options[lang]"
            :rules="rules"
            @update:options="setOptionParam(lang, $event)"
          ></options-list>
        </template>
      </language-selector>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption, LocaleOptionList } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { OptionsList } from '@intake24/admin/components/lists';

import type { PortionSizeMethodParameterItem } from '..';
import { useParameters } from './use-parameters';

export default defineComponent({
  name: 'MilkInAHotDrinkParameters',

  components: { LanguageSelector, OptionsList },

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { createObjectParameter, setParameter } = useParameters(props, context);

    const options = createObjectParameter<LocaleOptionList<number>>('options', { en: [] });

    const rules = [
      (value: any): boolean | string => {
        const msg = 'Value must be greater than 0';
        const number = Number.parseFloat(value);
        if (Number.isNaN(number)) return msg;

        return number > 0 || msg;
      },
    ];

    const setOptionParam = (lang: string, value: ListOption[]) => {
      options.value[lang] = value.map((item) => ({
        ...item,
        value: Number.parseFloat(item.value),
      }));
      // TODO: does not run a setter on deep object change
      setParameter('options', JSON.stringify(options.value));
    };

    return {
      options,
      rules,
      setOptionParam,
    };
  },
});
</script>
