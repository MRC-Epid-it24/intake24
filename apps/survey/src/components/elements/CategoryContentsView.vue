<template>
  <div class="d-flex" :class="categoriesFirst ? 'flex-column' : 'flex-column-reverse'">
    <v-list v-if="contents.subcategories.length" class="list__no-wrap pa-0">
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
            <span class="font-weight-medium">{{ category.name }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list v-if="contents.foods.length" class="list__no-wrap pa-0">
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
          <v-list-item-title>{{ food.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div v-if="contents.subcategories.length == 0 && contents.foods.length == 0" class="py-4">
      <v-alert color="grey lighten-2 mb-0" icon="fas fa-triangle-exclamation">
        {{ i18n.none }}
      </v-alert>
    </div>
    <div
      v-if="contents.foods.length >= 50"
      class="py-4"
      :class="categoriesFirst ? 'order-first' : 'order-last'"
    >
      <v-alert
        border="left"
        class="smaller-padding"
        color="primary lighten-4 mb-0"
        icon="fas fa-bell"
        rounded="lg"
      >
        {{ i18n.refine }}
      </v-alert>
    </div>
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
    i18n: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    categoriesFirst: {
      type: Boolean,
      default: true,
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

<style scoped>
.smaller-padding {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
