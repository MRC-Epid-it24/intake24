<template>
  <v-list v-if="foods.length" class="pa-0">
    <div v-for="food in foods" :key="food.id">
      <v-list-item
        :class="{ selected: food.id === selectedFoodId, 'pl-4': !linked, 'pl-8': linked }"
        link
        @click="emitFoodSelected(food.id)"
      >
        <v-list-item-title class="text-wrap">{{ getFoodName(food) }}</v-list-item-title>
        <v-list-item-action class="list-item">
          <v-tooltip v-if="food.type === 'free-text'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="grey" small v-on="on">$question</v-icon>
            </template>
            <span>{{ $t('recall.menu.food.notMatched') }}</span>
          </v-tooltip>
          <v-tooltip v-if="food.type === 'encoded-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
            </template>
            <span>{{ $t('recall.menu.food.encoded') }}</span>
          </v-tooltip>
          <v-tooltip v-if="food.type === 'missing-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
            </template>
            <span>{{ $t('recall.menu.food.missing') }}</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-action class="list-item">
          <v-tooltip v-if="food.type === 'encoded-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
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
              <v-icon v-bind="attrs" color="green darken-2" small v-on="on">fa-check</v-icon>
            </template>
            <span>
              {{
                $t(
                  `recall.menu.food.${food.info ? 'missingInfoComplete' : 'missingInfoIncomplete'}`
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
      </v-list-item>
      <food-item
        :foods="food.linkedFoods"
        linked
        :selected-food-id="selectedFoodId"
        @food-selected="onLinkedFoodSelected"
      ></food-item>
    </div>
  </v-list>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState } from '@intake24/common/types';
import { useFoodUtils } from '@intake24/survey/composables';

export default defineComponent({
  name: 'FoodItem',

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: {
      type: Array as PropType<FoodState[]>,
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

  emits: ['food-selected'],

  setup() {
    const { getFoodName } = useFoodUtils();

    return { getFoodName };
  },

  methods: {
    onLinkedFoodSelected(foodId: string) {
      this.emitFoodSelected(foodId);
    },

    emitFoodSelected(foodId: string) {
      this.$emit('food-selected', foodId);
    },
  },
});
</script>

<style scoped>
.list-item {
  min-width: 0;
}
</style>
