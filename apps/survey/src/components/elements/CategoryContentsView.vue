<template>
  <div>
    Subcategories:
    <v-list-item-group>
      <v-list-item
        v-for="category in contents.subcategories"
        :key="category.code"
        @click="emitCategorySelected(category)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ category.description }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>

    Foods:
    <v-list-item-group>
      <v-list-item v-for="food in contents.foods" :key="food.code" @click="emitFoodSelected(food)">
        <v-list-item-content>
          <v-list-item-title>{{ food.description }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { CategoryContents, CategoryHeader, FoodHeader } from '@intake24/common/types/http';

export default defineComponent({
  name: 'CategoryContentsView',

  props: {
    contents: {
      type: Object as PropType<CategoryContents>,
      required: true,
    },
  },

  methods: {
    emitFoodSelected(food: FoodHeader): void {
      this.$emit('food-selected', food);
    },

    emitCategorySelected(category: CategoryHeader): void {
      this.$emit('category-selected', category);
    },
  },
});
</script>
