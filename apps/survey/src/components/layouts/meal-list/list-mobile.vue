<template>
  <v-bottom-sheet>
    <template #activator="{ on, attrs }">
      <v-btn value="review" v-bind="attrs" v-on="on">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.review') }}
        </span>
        <v-icon class="pb-1">$survey</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
    </template>
    <v-list>
      <v-subheader>{{ $t('recall.menu.title') }}</v-subheader>
      <v-list class="meal-list pt-0" dense flat tile>
        <template v-for="meal in meals">
          <component
            :is="expandable ? 'meal-item-expandable' : 'meal-item'"
            :key="meal.id"
            :meal="meal"
            :selected="selectedMealId === meal.id"
            :selected-food-id="selectedFoodId"
            :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
            @action="action"
          ></component>
        </template>
      </v-list>
    </v-list>
  </v-bottom-sheet>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';

import MealItem from './meal-item.vue';
import MealItemExpandable from './meal-item-expandable.vue';
import { useMealList } from './use-meal-list';

export default defineComponent({
  name: 'MealListMobile',

  components: { MealItem, MealItemExpandable },

  props: {
    expandable: {
      type: Boolean,
      default: false,
    },
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  setup(props, context) {
    const { selectedMealId, selectedFoodId, isSelectedFoodInMeal, action } = useMealList(
      props,
      context
    );

    return {
      selectedMealId,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
    };
  },
});
</script>

<style lang="scss">
@import 'vuetify/src/styles/styles.sass';

.meal-list {
  .selected {
    background: map-get($orange, 'lighten-5');
  }

  .selected-food {
    background: map-get($orange, 'lighten-4');
  }

  .v-list-group__header {
    padding-left: 12px !important;
  }

  .v-list-item:hover {
    background: map-get($orange, 'lighten-5');
  }

  .v-list-group--active > .v-list-group__header > .v-list-group__header__prepend-icon {
    margin-right: 6px;

    .v-icon {
      transform: rotate(180deg);
    }
  }

  .v-list-group__header__append-icon {
    display: none !important;
  }
}
</style>
