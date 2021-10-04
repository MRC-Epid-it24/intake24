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
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import { FoodState } from '@common/types';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'FoodListMobileBottom',

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: Array as () => FoodState[],
    loading: Boolean,
    mealIndex: Number || undefined,
  },
  data() {
    return {
      entity: 'food',
    };
  },

  computed: {
    ...mapGetters('survey', ['selectedFoodIndex']),

    mealfoods() {
      return this.foods;
    },

    active_tab: {
      get() {
        return this.selectedFoodIndex + 1;
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
      if (food.type === 'encoded-food') dispalyName = food.data.localDescription;
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
