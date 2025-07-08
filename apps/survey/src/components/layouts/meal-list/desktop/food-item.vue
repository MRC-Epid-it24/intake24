<template>
  <div>
    <v-list-item
      :class="{ 'selected': food.id === selectedFoodId, 'ps-4': !linked, 'ps-8': linked }"
      link
      @click="action('selectFood', food.id)"
    >
      <v-list-item-title class="text-body-2 text-wrap">
        {{ foodName }}
      </v-list-item-title>
      <template #append>
        <v-list-item-action class="d-flex flex-row me-4">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                class="me-1"
                :color="isCustomPromptComplete ? 'green-darken-2' : 'grey'"
                :icon="isCustomPromptComplete ? '$ok' : '$question'"
                size="small"
              />
            </template>
            <span>
              Custom Prompt is {{ isCustomPromptComplete ? 'complete.' : 'incomplete.' }}
            </span>
          </v-tooltip>
          <!-- Food identification status tooltip -->
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <!-- Show question mark for free-text foods, checkmark for identified foods -->
              <v-icon
                v-if="food.type === 'free-text'"
                v-bind="props"
                class="me-1"
                color="grey"
                icon="$question"
                size="small"
              />
              <v-icon v-else class="me-1" color="green-darken-2" v-bind="props" icon="$ok" size="small" />
            </template>
            <span>{{ $t(`recall.menu.food.${food.type}._`) }}</span>
          </v-tooltip>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-icon

                :color="isPortionSizeComplete ? 'green darken-2' : undefined"
                size="small"
                v-bind="props"
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
        <v-list-item-action class="my-auto">
          <context-menu v-bind="{ food, meal, menu }" @action="action" />
        </v-list-item-action>
      </template>
    </v-list-item>
    <food-item
      v-for="linkedFood in food.linkedFoods"
      :key="linkedFood.id"
      v-bind="{ food: linkedFood, linked: true, meal, selectedFoodId }"
      @action="action"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState, MealState } from '@intake24/common/surveys';

import { useFoodItem } from '../use-food-item';
import ContextMenu from './context-menu.vue';

export default defineComponent({
  name: 'FoodItem',

  components: { ContextMenu },

  props: {
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
    const { action, foodName, isPortionSizeComplete, isCustomPromptComplete, menu } = useFoodItem(props, ctx);

    return { action, foodName, isPortionSizeComplete, isCustomPromptComplete, menu };
  },
});
</script>

<style scoped></style>
