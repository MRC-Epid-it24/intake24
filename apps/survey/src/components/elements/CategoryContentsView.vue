<template>
  <div>
    <v-list-item-group>
      <v-list-item
        v-for="category in contents.subcategories"
        :key="category.code"
        @click="emitCategorySelected(category)"
      >
        <v-list-item-content>
          <v-list-item-title>
            <span class="fa-regular fa-folder ml-0 mr-3"></span>
            <span class="font-weight-medium">{{ category.description }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>

    <v-list-item-group>
      <v-list-item v-for="food in contents.foods" :key="food.code" @click="emitFoodSelected(food)">
        <v-list-item-content>
          <v-list-item-title class="ml-7">{{ food.description }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </div>
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
