<template>
  <v-list v-if="foods.length > 0" :class="{ 'pa-0': linked }">
    <div v-for="(food, i) in foods" :key="i" :class="{ 'ml-4': linked }">
      <v-list-item
        class="ma-0 small"
        :class="{ selected: food.id === selectedFoodId }"
        link
        @click="emitFoodSelected(food.id)"
      >
        <v-list-item-title class="text-wrap"
          ><span :class="{ 'linked-food-title': linked }"> {{ foodDisplayName(food) }}</span>
        </v-list-item-title>
        <v-list-item-action class="list-item">
          <v-tooltip v-if="food.type === 'encoded-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
            </template>
            <span>{{ $t('recall.menu.foodSearchCompleteTooltip') }}</span>
          </v-tooltip>
          <v-tooltip v-if="food.type === 'free-text'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="grey" small v-on="on">fa-question-circle</v-icon>
            </template>
            <span>{{ $t('recall.menu.foodSearchTooltip') }}</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-action class="list-item">
          <v-tooltip v-if="food.portionSize" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
            </template>
            <span>{{ $t('recall.menu.portionSizeCompleteTooltip') }}</span>
          </v-tooltip>
          <v-tooltip v-if="!food.portionSize" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="grey" small v-on="on">fa-question-circle</v-icon>
            </template>
            <span>{{ $t('recall.menu.portionSizeTooltip') }}</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <food-item
        :foods="food.linkedFoods"
        linked
        :selected-food-id="selectedFoodId"
        @food-selected="onLinkedFoodSelected"
      ></food-item>
    </div>
  </v-list>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState } from '@intake24/common/types';
import LocaleContent from '@intake24/survey/components/mixins/localeContent';

export default defineComponent({
  name: 'FoodItem',

  mixins: [LocaleContent],

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: {
      type: Array as PropType<FoodState[]>,
      required: true,
    },
    linked: {
      type: Boolean,
      default: false,
    },
    selectedFoodId: {
      type: Number,
      required: false,
    },
  },

  data() {
    return {};
  },

  methods: {
    onLinkedFoodSelected(foodId: number) {
      this.emitFoodSelected(foodId);
    },

    emitFoodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },
    foodDisplayName(food: FoodState): string {
      if (food.type === 'free-text') return food.description;
      if (food.type === 'encoded-food') return food.data.localName;

      return '???';
    },
  },
});
</script>

<style scoped>
.linked-food-title {
}
.selected {
  background: #f5f5f5;
}
.list-item {
  min-width: 0;
}
</style>
