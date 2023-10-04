<template>
  <v-card>
    <v-card-title>
      {{ $t('recall.menu.title') }}
    </v-card-title>
    <v-divider></v-divider>
    <v-list class="meal-list__list pt-0" dense flat tile>
      <div v-for="meal in meals" :key="meal.id">
        <component
          :is="expandable ? 'meal-item-expandable' : 'meal-item'"
          v-bind="{ meal, selectedMealId, selectedFoodId }"
          :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
          @action="action"
        ></component>
      </div>
    </v-list>
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn
          block
          :color="hover ? 'primary' : 'inherit'"
          depressed
          :title="$t('recall.menu.meal.add')"
          @click="action('addMeal')"
        >
          <v-icon left>$add</v-icon>
          {{ $t('recall.menu.meal.add') }}
        </v-btn>
      </v-hover>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';

import type { MealState } from '@intake24/common/types';

import { useMealList } from '../use-meal-list';
import MealItem from './meal-item.vue';
import MealItemExpandable from './meal-item-expandable.vue';

export default defineComponent({
  name: 'ReviewMealListScroll',

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

  setup(props, ctx) {
    const { selectedMealId, selectedFoodId, isSelectedFoodInMeal, action } = useMealList(
      props,
      ctx
    );

    const checkScroll = (entries: IntersectionObserverEntry[]) => {
      const el = entries[0].target as HTMLElement;
      const isBottom = entries[0].isIntersecting;
      if (isBottom) {
        ctx.emit('reached-bottom', true);
      }
      const isScrollable = el.scrollHeight > el.clientHeight;
      if (isBottom && (!isScrollable || el.scrollHeight === el.clientHeight)) {
        ctx.emit('reached-bottom', true);
      }
    };

    const observer = new IntersectionObserver(checkScroll, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    onMounted(() => {
      const el = document.querySelector('.meal-list__list');
      if (el) {
        observer.observe(el);
      }
    });

    onBeforeUnmount(() => {
      const el = document.querySelector('.meal-list__list');
      if (el) {
        observer.unobserve(el);
      }
    });

    return {
      selectedMealId,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
      checkScroll,
    };
  },
});
</script>

<style lang="scss">
.review-checkbox__checkbox .v-label {
  font-size: 0.8125rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}
</style>
