<template>
  <v-card flat>
    <v-card-title>
      Your salt consumption during the day
    </v-card-title>
    <v-divider />
    <v-list class="meal-list__list pt-0" dense flat tile>
      <div v-for="meal in meals" :key="meal.id">
        <v-card class="meal-item" flat>
          <v-card-title>{{ meal.name.en }}</v-card-title>
          <v-divider />
          <v-list dense>
            <v-list-item v-for="food in meal.foods" :key="food.id">
              <v-list-item-content>
                <v-list-item-title>{{ food.data.localName }}</v-list-item-title>
                <div class="d-flex flex-row align-center pa-4 ga-4">
                  <v-checkbox
                    class="review-checkbox__checkbox font-weight-medium mt-0"
                    label="Salt during preparation"
                  />
                  <v-select
                    class="ml-4 salt-select font-weight-medium mt-0"
                    dense
                    :items="['0.5g', '0.8g', '5g']"
                    label="Portion options"
                  />
                  <v-select
                    class="ml-4 salt-select font-weight-medium mt-0"
                    dense
                    :items="['1/4', '1/2', '3/4', '1', '1.5', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
                    label="Number of portions"
                  />
                </div>
                <div class="d-flex flex-row align-center pa-4 ga-4">
                  <v-checkbox
                    v-model="food.saltAddedAtTable"
                    class="review-checkbox__checkbox font-weight-medium mt-0"
                    label="Salt added at table"
                  />
                  <v-select
                    v-model="food.portionType"
                    class="ml-4 salt-select font-weight-medium mt-0"
                    dense
                    :items="['0.5g', '0.8g', '5g']"
                    label="Portion options"
                  />
                  <v-select
                    v-model="food.portionNumber"
                    class="ml-4 salt-select font-weight-medium mt-0"
                    dense
                    :items="['1/4', '1/2', '3/4', '1', '1.5', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
                    label="Number of portions"
                  />
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </v-list>
    <v-card class="d-flex flex-row align-center pa-4 ga-4" flat>
      <v-text-field
        v-model="saltType"
        class="review-checkbox__checkbox font-weight-medium mt-0"
        label="What type of salt do you use most often?"
      />
    </v-card>
    <v-card-actions class="pa-4">
      <v-btn color="primary" @click="handleSubmit">
        Continue
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';

import { useMealList } from '../../layouts/meal-list/use-meal-list';

export default defineComponent({
  name: 'SaltConsumptionForm',

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
      ctx,
    );

    return {
      selectedMealId,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
    };
  },

  methods: {
    handleSubmit() {
      // Handle form submission
      console.log('Form data:', this.meals, this.saltType);
    },
  },
});
</script>

  <style lang="scss">
  // .checkbox-label {
//   font-size: 1rem; /* Adjust this value to match the size of the food names */
// }

.review-checkbox__checkbox .v-label {
  font-size: 0.8125rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
}

.salt-select .v-label {
  font-size: 0.8125rem;
}

.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.ml-4 {
  margin-left: 1rem;
}
.flex-row {
  flex-direction: row;
}
</style>
