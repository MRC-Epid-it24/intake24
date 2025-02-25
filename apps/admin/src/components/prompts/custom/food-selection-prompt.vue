<template>
  <v-tabs-window-item key="options" value="options">
    <v-row class="ml-2" dense>
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :label="$t('survey-schemes.prompts.food-selection-prompt.useFlag')"
          :model-value="useFlag"
          @update:model-value="update('useFlag', $event)"
        />
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-row v-show="useFlag" class="ml-2" dense>
        <v-col cols="12" md="6">
          <v-text-field :label="$t('survey-schemes.prompts.food-selection-prompt.flag')" :model-value="flag" @update:model-value="update('flag', $event)" />
        </v-col>
      </v-row>
    </v-expand-transition>

    <v-row class="ml-2" dense>
      <v-col cols="12" md="6">
        <v-switch v-model="filterEnabled" hide-details="auto" :label="$t('survey-schemes.prompts.food-selection-prompt.filter')" @update:model-value="updateFilterEnabled($event)" />
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-card v-if="foodFilter !== undefined" flat>
        <v-card-text class="px-0 pt-0">
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
                :model-value="foodFilter.object"
                variant="outlined"
                @update:model-value="updateFilterObject($event)"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                hide-details="auto"
                item-value="type"
                :items="propertySelectList[foodFilter.object]"
                :label="$t('survey-schemes.conditions.property._')"
                :model-value="foodFilter.property.id"
                variant="outlined"
                @update:model-value="updateFilterProperty($event)"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-title>{{ $t(`survey-schemes.conditions._`) }}</v-card-title>
        <v-card-text>
          <component :is="foodFilter.property.type" :model-value="foodFilter.property.check" @update="updateFilterCheck($event)" />
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapValues } from 'lodash';
import { defineComponent, ref } from 'vue';

import { LanguageSelector } from '@intake24/admin/components/forms';
import conditionPartials from '@intake24/admin/components/prompts/partials/conditions';
import { conditionObjectHasProperty, getConditionDefaults, getDefaultConditionProperty, promptConditionDefaults } from '@intake24/common/prompts';
import type { Condition, ConditionObjectId, ObjectPropertyId } from '@intake24/common/prompts';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

import { useBasePrompt } from '../partials';

export default defineComponent({
  name: 'FoodSelectionPrompt',

  components: { LanguageSelector, ...conditionPartials.check, ConditionSummary: conditionPartials.summary },

  props: {
    foodFilter: {
      type: Object as PropType<Condition>,
    },
    useFlag: {
      type: Boolean,
    },
    flag: {
      type: String,
    },
  },

  emits: ['close', 'update:options'],

  setup(props, ctx) {
    const { i18n } = useI18n();
    const { update, updateLanguage } = useBasePrompt(props, ctx);

    const allowedConditionObjects = ['meal', 'food'] as const;

    const objectSelectList: { object: ConditionObjectId; title: string }[]
      = allowedConditionObjects.map(object => ({ object, title: i18n.t(`survey-schemes.conditions.object.${object}`) }));

    const propertySelectList: Record<ConditionObjectId, { type: string; title: string }[]>
      = mapValues(promptConditionDefaults, properties => Object.keys(properties).map(id => ({ type: id, title: i18n.t(`survey-schemes.conditions.property.${id}`) })));

    const filterEnabled = ref(props.foodFilter !== undefined);

    const updateFoodFilter = (newFilter: Condition | undefined) => {
      update('foodFilter', newFilter);
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

    const updateFilterEnabled = (enabled: boolean | null) => {
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
      update,
      updateLanguage,
    };
  },
});
</script>

<style lang="scss" scoped></style>
