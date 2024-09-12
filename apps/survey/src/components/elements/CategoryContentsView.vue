<template>
  <div class="d-flex flex-column">
    <div v-if="!contents.subcategories.length && !contents.foods.length" class="py-4">
      <v-alert color="grey lighten-2 mb-0" icon="fas fa-triangle-exclamation">
        {{ i18n.none }}
      </v-alert>
    </div>
    <div v-if="containsPizza" class="py-4">
      <v-alert
        border="left"
        class="smaller-padding"
        color="primary lighten-4 mb-0"
        icon="fas fa-bell"
        rounded="lg"
      >
        {{ i18n.pizza }}
      </v-alert>
    </div>
    <div v-if="contents.foods.length >= 50 && type === 'foodSearch'" class="py-4">
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
    <v-subheader v-if="contents.subcategories.length">
      {{ i18n.relatedCategories }}
    </v-subheader>
    <v-chip-group v-if="contents.subcategories.length" column>
      <v-chip
        v-for="category in showAll ? contents.subcategories : firstCategories"
        :key="category.code"
        class="my-1"
        clickable
        color="primary"
        outlined
        @click="categorySelected(category)"
      >
        <span class="font-weight-medium">{{ category.name }}</span>
      </v-chip>
    </v-chip-group>
    <v-btn
      v-if="contents.subcategories.length > threshold"
      class="my-1 mb-2 show-all-toggle-chip"
      color="info"
      text
      @click="showAll = !showAll"
    >
      {{ showAll ? i18n.showLess : i18n.showAll }}
    </v-btn>
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
    searchTerm: {
      type: String as PropType<string>,
      default: '',
    },
    type: {
      type: String as PropType<string>,
      default: '',
    },
  },

  emits: ['food-selected', 'category-selected'],

  data() {
    return {
      expanded: false,
      showAll: false,
      threshold: 5,
    };
  },

  computed: {
    firstCategories(): CategoryHeader[] {
      return this.contents.subcategories.slice(0, this.threshold);
    },
    remainingCategories(): CategoryHeader[] {
      return this.contents.subcategories.slice(this.threshold);
    },
    containsPizza(): boolean | null {
      return this.searchTerm.toLowerCase().includes('pizza');
    },
  },

  methods: {
    categorySelected(category: CategoryHeader): void {
      this.$emit('category-selected', category);
    },

    foodSelected(food: FoodHeader): void {
      this.$emit('food-selected', food);
    },

    toggleExpand() {
      this.expanded = !this.expanded;
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
