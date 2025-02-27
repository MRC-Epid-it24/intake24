<template>
  <div class="d-flex flex-column gr-4">
    <v-alert
      v-if="!contents.subcategories.length && !contents.foods.length"
      border="start"
      class="py-2"
      icon="fas fa-triangle-exclamation"
      type="info"
    >
      {{ i18n.none }}
    </v-alert>
    <v-alert
      v-if="containsPizza"
      border="start"
      class="py-2"
      icon="fas fa-bell"
      rounded="lg"
      type="info"
    >
      {{ i18n.pizza }}
    </v-alert>
    <v-alert
      v-if="contents.foods.length >= 50 && type === 'foodSearch'"
      border="start"
      class="py-2"
      icon="fas fa-bell"
      rounded="lg"
      type="info"
    >
      {{ i18n.refine }}
    </v-alert>
    <div v-if="contents.subcategories.length" class="text-body-2 mt-2">
      {{ i18n.relatedCategories }}
    </div>
    <v-chip-group
      v-if="contents.subcategories.length"
      class="text-primary py-0"
      color="primary"
      column
      variant="outlined"
    >
      <v-chip
        v-for="category in showAll ? contents.subcategories : firstCategories"
        :key="category.code"
        class="chip__no-wrap py-1"
        clickable
        @click="categorySelected(category)"
      >
        <span class="font-weight-medium">{{ category.name }}</span>
      </v-chip>
    </v-chip-group>
    <v-btn
      v-if="contents.subcategories.length > threshold"
      color="info"
      variant="text"
      @click="showAll = !showAll"
    >
      {{ showAll ? i18n.showLess : i18n.showAll }}
    </v-btn>
    <v-list v-if="contents.foods.length" class="list-border list__no-wrap py-0" slim>
      <v-list-item
        v-for="food in contents.foods"
        :key="food.code"
        @click="foodSelected(food)"
      >
        <template #prepend>
          <v-icon icon="$food" />
        </template>
        <v-list-item-title>{{ food.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { CategoryContents, CategoryHeader, FoodHeader } from '@intake24/common/types/http';
import { GtmEvents, GtmSchemePrompts, sendGtmEvent } from '@intake24/ui/tracking';
import type { GtmEventParams } from '@intake24/ui/tracking';

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
    searchCount: {
      type: Number as PropType<number>,
      default: 0,
    },
    percentScrolled: {
      type: Number as PropType<number>,
      default: 0,
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
      const params: GtmEventParams = {
        food_category: category.name,
        search_term: this.searchTerm,
        search_count: this.searchCount,
        percent_scrolled: this.percentScrolled,
        noninteraction: false,
      };
      for (const key in GtmEvents) {
        if (GtmEvents[key] === 'selectFoodCategory') {
          params.event = GtmEvents[key];
        }
      }
      for (const key in GtmSchemePrompts) {
        if (GtmSchemePrompts[key] === 'foods') {
          params.scheme_prompts = GtmSchemePrompts[key];
        }
      }
      sendGtmEvent(params);
    },

    foodSelected(food: FoodHeader): void {
      this.$emit('food-selected', food);
      const params: GtmEventParams = {
        food: food.name,
        search_term: this.searchTerm,
        search_count: this.searchCount,
        percent_scrolled: this.percentScrolled,
        noninteraction: false,
      };
      for (const key in GtmEvents) {
        if (GtmEvents[key] === 'selectFood') {
          params.event = GtmEvents[key];
        }
      }
      for (const key in GtmSchemePrompts) {
        if (GtmSchemePrompts[key] === 'foods') {
          params.scheme_prompts = GtmSchemePrompts[key];
        }
      }
      sendGtmEvent(params);
    },

    toggleExpand() {
      this.expanded = !this.expanded;
    },
  },
});
</script>

<style scoped></style>
