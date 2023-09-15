<template>
  <div>
    <v-list-item
      :class="{ selected: food.id === selectedFoodId, 'pl-4': !linked, 'pl-8': linked }"
      link
      @click="action('selectFood', food.id)"
    >
      <v-list-item-title class="text-wrap">{{ foodName }}</v-list-item-title>
      <v-list-item-action class="d-flex flex-row">
        <v-tooltip v-if="food.type === 'free-text'" bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" class="mr-1" color="grey" small v-on="on">$question</v-icon>
          </template>
          <span>{{ $t('recall.menu.food.notMatched') }}</span>
        </v-tooltip>
        <v-tooltip v-if="food.type === 'encoded-food' || food.type === 'recipe-builder'" bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" class="mr-1" color="green darken-2" small v-on="on">
              $ok
            </v-icon>
          </template>
          <span>{{ $t('recall.menu.food.encoded') }}</span>
        </v-tooltip>
        <v-tooltip v-if="food.type === 'missing-food'" bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" class="mr-1" color="green darken-2" small v-on="on">
              $ok
            </v-icon>
          </template>
          <span>{{ $t('recall.menu.food.missing') }}</span>
        </v-tooltip>
        <v-tooltip v-if="food.type === 'encoded-food'" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              :color="food.portionSize ? 'green darken-2' : undefined"
              small
              v-on="on"
            >
              {{ food.portionSize ? '$ok' : '$question' }}
            </v-icon>
          </template>
          <span>
            {{
              $t(
                `recall.menu.food.${
                  food.portionSize ? 'portionSizeComplete' : 'portionSizeIncomplete'
                }`
              )
            }}
          </span>
        </v-tooltip>
        <v-tooltip v-else-if="food.type === 'missing-food'" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              :color="food.info ? 'green darken-2' : undefined"
              small
              v-on="on"
            >
              {{ food.info ? '$ok' : '$question' }}
            </v-icon>
          </template>
          <span>
            {{
              $t(`recall.menu.food.${food.info ? 'missingInfoComplete' : 'missingInfoIncomplete'}`)
            }}
          </span>
        </v-tooltip>
        <v-tooltip v-else-if="food.type === 'recipe-builder'" bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              :color="
                food.components.find((component) => component.ingredients.length === 0)
                  ? undefined
                  : 'green darken-2'
              "
              small
              v-on="on"
            >
              {{
                food.components.find((component) => component.ingredients.length === 0)
                  ? '$question'
                  : '$ok'
              }}
            </v-icon>
          </template>
          <span>
            {{
              $t(
                `recall.menu.food.${
                  food.components.find((component) => component.ingredients.length === 0)
                    ? 'recipeFoodStepsIncomplete'
                    : 'recipeFoodStepsComplete'
                }`
              )
            }}
          </span>
        </v-tooltip>
        <v-tooltip v-else bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" color="grey" small v-on="on">$question</v-icon>
          </template>
          <span>{{ $t('recall.menu.food.portionSizeIncomplete') }}</span>
        </v-tooltip>
      </v-list-item-action>
      <v-list-item-action class="my-auto">
        <context-menu
          :entity="food"
          :entity-name="foodName"
          v-bind="{ menu }"
          @action="action"
        ></context-menu>
      </v-list-item-action>
    </v-list-item>
    <food-item
      v-for="linkedFood in food.linkedFoods"
      :key="linkedFood.id"
      v-bind="{ food: linkedFood, linked: true, selectedFoodId }"
      @action="action"
    ></food-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState } from '@intake24/common/types';

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
    selectedFoodId: {
      type: String,
      required: false,
    },
  },

  setup(props, ctx) {
    const { action, foodName, menu } = useFoodItem(props, ctx);

    return { action, foodName, menu };
  },
});
</script>

<style scoped></style>
