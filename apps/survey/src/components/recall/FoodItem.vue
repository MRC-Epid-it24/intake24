<template>
  <v-list v-if="foods.length" class="pa-0">
    <div v-for="food in foods" :key="food.id">
      <v-list-item
        :class="{ selected: food.id === selectedFoodId, 'pl-4': !linked, 'pl-8': linked }"
        link
        @click="emitFoodSelected(food.id)"
      >
        <v-list-item-title class="text-wrap">{{ foodDisplayName(food) }}</v-list-item-title>
        <v-list-item-action class="list-item">
          <v-tooltip v-if="food.type === 'encoded-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
            </template>
            <span>{{ $t('recall.menu.foodSearchCompleteTooltip') }}</span>
          </v-tooltip>
          <v-tooltip v-else bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="grey" small v-on="on">fa-question-circle</v-icon>
            </template>
            <span>{{ $t('recall.menu.foodSearchTooltip') }}</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-action class="list-item">
          <v-tooltip v-if="food.type === 'encoded-food' && food.portionSize" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
            </template>
            <span>{{ $t('recall.menu.portionSizeCompleteTooltip') }}</span>
          </v-tooltip>
          <v-tooltip v-else bottom>
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

export default defineComponent({
  name: 'FoodItem',

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

  methods: {
    onLinkedFoodSelected(foodId: number) {
      this.emitFoodSelected(foodId);
    },

    emitFoodSelected(foodId: number) {
      this.$emit('food-selected', foodId);
    },

    foodDisplayName(food: FoodState): string {
      return food.type === 'free-text' ? food.description : food.data.localName;
    },
  },
});
</script>

<style scoped>
.list-item {
  min-width: 0;
}
</style>
