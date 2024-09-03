<template>
  <v-tab-item key="options" value="options">
    <language-selector
      :default="[]"
      flat
      :label="$t('common.options.title').toString()"
      :value="options"
      @input="update('options', $event)"
    >
      <template v-for="lang in Object.keys(options)" #[`lang.${lang}`]>
        <options-list
          :key="lang"
          :options="options[lang]"
          @update:options="updateLanguage('options', lang, $event)"
        />
      </template>
    </language-selector>

    <v-card outlined>
      <v-card-title>
        <v-checkbox v-model="filterEnabled" label="Ask only for specific foods" @change="updateFilterEnabled($event)" />
      </v-card-title>
      <div v-if="foodFilter !== undefined">
        <v-card-text class="px-0">
          <condition-summary :condition="foodFilter" />
        </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                hide-details="auto"
                item-value="object"
                :items="objectSelectList"
                :label="$t('survey-schemes.conditions.object._')"
                outlined
                :value="foodFilter.object"
                @change="updateFilterObject($event)"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                hide-details="auto"
                item-value="type"
                :items="propertySelectList[foodFilter.object]"
                :label="$t('survey-schemes.conditions.property._')"
                outlined
                :value="foodFilter.property.id"
                @change="updateFilterProperty($event)"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-title>{{ $t(`survey-schemes.conditions._`) }}</v-card-title>
        <v-card-text>
          <component :is="foodFilter.property.type" :value="foodFilter.property.check" @update="updateFilterCheck($event)" />
        </v-card-text>
      </div>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { mapValues } from 'lodash';
import { defineComponent, type PropType, ref } from 'vue';

import type { LocaleOptionList } from '@intake24/common/types';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { OptionsList } from '@intake24/admin/components/lists';
import conditionPartials from '@intake24/admin/components/prompts/partials/conditions';
import { type Condition, conditionObjectHasProperty, type ConditionObjectId, getConditionDefaults, getDefaultConditionProperty, type ObjectPropertyId, promptConditionDefaults } from '@intake24/common/prompts';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n/index';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'AggregateChoicePrompt',

  components: { OptionsList, LanguageSelector, ...conditionPartials.check, ConditionSummary: conditionPartials.summary },

  mixins: [basePrompt],

  props: {
    options: {
      type: Object as PropType<LocaleOptionList>,
      required: true,
    },
    foodFilter: {
      type: Object as PropType<Condition>,
    },
  },

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const allowedConditionObjects = ['meal', 'food'] as const;

    const objectSelectList: { object: ConditionObjectId; text: string }[]
      = allowedConditionObjects.map(object => ({ object, text: i18n.t(`survey-schemes.conditions.object.${object}`).toString() }));

    const propertySelectList: Record<ConditionObjectId, { type: string; text: string }[]>
      = mapValues(promptConditionDefaults, properties => Object.keys(properties).map(id => ({ type: id, text: i18n.t(`survey-schemes.conditions.property.${id}`).toString() })));

    const filterEnabled = ref(props.foodFilter !== undefined);

    const updateFoodFilter = (newFilter: Condition | undefined) => {
      emit('update:foodFilter', newFilter);
    };

    const updateFilterObject = (newObjectId: ConditionObjectId) => {
      if (props.foodFilter === undefined)
        throw new Error('Didn\'t expect foodFilter to be undefined here');

      if (props.foodFilter.object === newObjectId)
        return;

      if (conditionObjectHasProperty(newObjectId, props.foodFilter.property.id)) {
        updateFoodFilter(copy({ ...props.foodFilter, object: newObjectId } as Condition));
      }
      else {
        updateFoodFilter(copy({ ...getConditionDefaults(newObjectId, getDefaultConditionProperty(newObjectId)) }));
      }
    };

    const updateFilterProperty = (newPropertyId: string) => {
      if (props.foodFilter === undefined)
        throw new Error('Didn\'t expect foodFilter to be undefined here');

      if (props.foodFilter.property.id === newPropertyId)
        return;

      updateFoodFilter(copy({ ...getConditionDefaults(props.foodFilter.object, newPropertyId as ObjectPropertyId<ConditionObjectId>) }),
      );
    };

    const updateFilterCheck = (check: any) => {
      if (props.foodFilter === undefined)
        throw new Error('Didn\'t expect foodFilter to be undefined here');

      updateFoodFilter(copy({ ...props.foodFilter, check }));
    };

    const updateFilterEnabled = (enabled: boolean) => {
      if (enabled)
        updateFoodFilter(copy({ ...getConditionDefaults('food', getDefaultConditionProperty('food')) }));
      else
        updateFoodFilter(undefined);
    };

    return {
      objectSelectList,
      propertySelectList,
      updateFilterObject,
      updateFilterProperty,
      updateFilterCheck,
      filterEnabled,
      updateFilterEnabled,
    };
  },
});
</script>

<style lang="scss" scoped></style>
