<template>
  <v-card flat :loading="loading">
    <v-toolbar flat dense>
      <v-tabs center-active touch show-arrows icons-and-text v-model="active_tab">
        <v-tab class="add_button" @click="onAddFood('edit-foods')">
          <span>FOOD</span>
          <span>ADD</span>
        </v-tab>
        <v-tab
          v-for="(food, i) in mealfoods"
          :key="i"
          @click="selectedFood(i, mealIndex, foodDisplayName(food), entity)"
        >
          {{ foodDisplayName(food) }}
          <v-icon x-small v-if="food.code" color="green darken-2">fa-check</v-icon>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { mapState } from 'pinia';
import { FoodState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'FoodListMobileBottom',

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: {
      type: Array as PropType<FoodState[]>,
      default: () => [],
    },
    loading: Boolean,
    mealIndex: Number || undefined,
  },
  data() {
    return {
      entity: 'food',
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedFoodIndex']),

    mealfoods(): FoodState[] {
      return this.foods;
    },

    active_tab: {
      get(): number {
        return this.selectedFoodIndex || 0 + 1;
      },

      set(id: number) {
        return id;
      },
    },
  },

  methods: {
    selectedFood(foodIndex: number, mealIndex: number | undefined, name: string, entity: string) {
      if (mealIndex !== undefined)
        this.$emit('displayFoodContext', { foodIndex, mealIndex, name, entity });
      this.active_tab = foodIndex + 1;
    },
    foodDisplayName(food: FoodState): string {
      let dispalyName = '???';
      if (food.type === 'free-text') dispalyName = food.description;
      if (food.type === 'encoded-food') dispalyName = food.data.localName;
      if (dispalyName.length > 16) dispalyName = dispalyName.slice(0, 16).concat('...');
      return dispalyName;
    },
    onAddFood(action: string) {
      this.$emit('meal-action', {
        mealIndex: this.$props.mealIndex,
        action,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
