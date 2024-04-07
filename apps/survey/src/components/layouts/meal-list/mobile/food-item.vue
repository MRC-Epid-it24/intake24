<template>
  <div>
    <v-list-item
      :class="{
        'selected': contextId ? food.id === contextId : food.id === selectedFoodId,
        'pl-4': !linked,
        'pl-8': linked,
      }"
      link
      @click="updateContextId(food.id)"
    >
      <v-list-item-title class="text-wrap">
        {{ foodName }}
      </v-list-item-title>
      <v-list-item-action class="d-flex flex-row">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              v-if="food.type === 'free-text'"
              v-bind="attrs"
              class="mr-1"
              color="grey"
              small
              v-on="on"
            >
              $question
            </v-icon>
            <v-icon v-else v-bind="attrs" class="mr-1" color="green darken-2" small v-on="on">
              $ok
            </v-icon>
          </template>
          <span>{{ $t(`recall.menu.food.${food.type}._`) }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              :color="isPortionSizeComplete ? 'green darken-2' : undefined"
              small
              v-on="on"
            >
              {{ isPortionSizeComplete ? '$ok' : '$question' }}
            </v-icon>
          </template>
          <span>
            {{
              $t(
                `recall.menu.food.${food.type}.${isPortionSizeComplete ? 'complete' : 'incomplete'}`,
              )
            }}
          </span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
    <context-menu v-bind="{ contextId, food, meal, menu }" @action="action" />
    <food-item
      v-for="linkedFood in food.linkedFoods"
      :key="linkedFood.id"
      v-bind="{ contextId, food: linkedFood, linked: true, meal, selectedFoodId }"
      @action="action"
      @update:context-id="updateContextId"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState, MealState } from '@intake24/common/types';

import { useFoodItem } from '../use-food-item';
import ContextMenu from './context-menu.vue';

export default defineComponent({
  name: 'FoodItem',

  components: { ContextMenu },

  props: {
    contextId: {
      type: String,
    },
    food: {
      type: Object as PropType<FoodState>,
      required: true,
    },
    linked: {
      type: Boolean,
      default: false,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    selectedFoodId: {
      type: String,
      required: false,
    },
  },

  setup(props, ctx) {
    const { action, foodName, isPortionSizeComplete, menu } = useFoodItem(props, ctx);

    const updateContextId = (id: string) => {
      ctx.emit('update:context-id', id);
    };

    return {
      action,
      foodName,
      isPortionSizeComplete,
      menu,
      updateContextId,
    };
  },
});
</script>

<style scoped></style>
