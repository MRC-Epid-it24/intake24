<template>
  <div v-if="contents.subcategories.length || contents.foods.length">
    <v-list-item
      v-for="category in contents.subcategories"
      :key="category.code"
      class="list-item-border"
      @click="categorySelected(category)"
    >
      <v-list-item-icon>
        <v-icon>$category</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          <span class="font-weight-medium">{{ category.description }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      v-for="food in contents.foods"
      :key="food.code"
      class="list-item-border"
      @click="foodSelected(food)"
    >
      <v-list-item-icon>
        <v-icon>$food</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ food.description }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
  <v-alert v-else class="mt-2" color="grey lighten-2" icon="fas fa-triangle-exclamation">
    {{ $t('prompts.foodBrowser.none') }}
  </v-alert>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { CategoryContents, CategoryHeader, FoodHeader } from '@intake24/common/types/http';

export default defineComponent({
  name: 'CategoryContentsView',

  props: {
    contents: {
      type: Object as PropType<CategoryContents>,
      required: true,
    },
  },

  emits: ['food-selected', 'category-selected'],

  methods: {
    categorySelected(category: CategoryHeader): void {
      this.$emit('category-selected', category);
    },

    foodSelected(food: FoodHeader): void {
      this.$emit('food-selected', food);
    },
  },
});
</script>
