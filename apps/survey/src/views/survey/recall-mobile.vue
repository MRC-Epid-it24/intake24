<template>
  <v-row justify="center" class="pt-2">
    <recall-bread-crumbs-mobile :promptName="activePrompt"></recall-bread-crumbs-mobile>
    <v-col cols="12" lg="9" class="content" v-if="bottomNavTab !== 1">
      <transition name="component-fade" mode="out-in">
        <!-- FIXME: Random key is a hacky way to force Vue to re-create the dynamic component on prompt switch
        even if the next prompt uses the same component type, probably should be something like an internal counter,
        or maybe not  ¯\_(ツ)_/¯  -->

        <component
          v-if="currentPrompt"
          :is="handlerComponent"
          :promptComponent="currentPrompt.prompt.component"
          :promptId="currentPrompt.prompt.id"
          :promptProps="currentPrompt.prompt.props"
          :key="Math.random()"
          @complete="nextPrompt"
        ></component>
      </transition>
    </v-col>

    <v-col cols="12" lg="9" class="content" v-if="bottomNavTab === 1">
      <review :meals="meals" :surveyName="surveyName" :activeMealIndex="mealIndex"></review>
    </v-col>

    <v-col cols="12" class="stickybottom" v-show="showMealList && bottomNavTab === 2">
      <meal-list-mobile-bottom
        v-show="meals.length > 0"
        :meals="meals"
        :selectedMealIndex="selectedMealIndex"
        @mealSelected="onMealSelected"
        @recall-action="onRecallAction"
      >
      </meal-list-mobile-bottom>
    </v-col>

    <transition type="fade">
      <v-bottom-navigation
        app
        fixed
        grow
        v-if="showMealList"
        v-model="bottomNavTab"
        @change="onBottomNavChange"
        background-color="secondary"
        color="white"
      >
        <v-btn>
          <span>Add meal</span>
          <v-icon>fa-plus</v-icon>
        </v-btn>

        <v-btn>
          <span>Review</span>
          <v-icon>$survey</v-icon>
        </v-btn>

        <v-btn>
          <span>Next question</span>
          <v-icon>fa-angle-right</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </transition>

    <!-- Context menu for Meal or Food with actions options -->
    <meal-food-mobile-context-menu
      :show="mobileMealFoodContextMenu.show"
      :entityName="mobileMealFoodContextMenu.foodContext ? activeFood : activeMeal"
      :entityIndex="
        mobileMealFoodContextMenu.foodContext
          ? mobileMealFoodContextMenu.foodIndex
          : mobileMealFoodContextMenu.mealIndex
      "
      :mealIndex="mobileMealFoodContextMenu.mealIndex"
      :entityType="mobileMealFoodContextMenu.foodContext"
      @toggleMobileMealContext="onMobileMealFoodContextMenu"
      @meal-action="onMealAction"
      @complete="nextPrompt"
    ></meal-food-mobile-context-menu>

    <info-alert
      :status="undo ? true : false"
      :info="undo ? 'Undo deletion of ' + undo.type : ''"
      @alert-dismissed="clearUndo"
    ></info-alert>
  </v-row>
</template>

<script lang="ts">
import { FoodState } from '@common/types';
import Recall from './recall';
import MealListMobileBottom from '@/components/recall/mobile/MealListMobileBottom.vue';
import FoodListMobileBottom from '@/components/recall/mobile/FoodListMobileBottom.vue';
import RecallBreadCrumbsMobile from '@/components/recall/mobile/BreadCrumbsMobile.vue';
import MealFoodMobileContextMenu from '@/components/recall/MobileMealFoodContext.vue';

import CustomPromptHandler from '@/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import BottomNavigationMobile from '@/components/recall/mobile/BottomNavMobile.vue';
import Review from '@/components/recall/mobile/review/Review.vue';

export default Recall.extend({
  name: 'RecallMobile',

  components: {
    Review,
    MealListMobileBottom,
    FoodListMobileBottom,
    RecallBreadCrumbsMobile,
    MealFoodMobileContextMenu,
    CustomPromptHandler,
    BottomNavigationMobile,
  },

  data: () => {
    return {
      bottomNavTab: 2,
      mobileMealFoodContextMenu: {
        show: false,
        mealIndex: 0,
        foodIndex: 0,
        foodContext: false,
      },
    };
  },

  methods: {
    // FIXME: Should use nested router for this
    onBottomNavChange(tab: number) {
      if (tab === 0) {
        this.onRecallAction('add-meal');
      } else if (tab === 2) {
        this.nextPrompt();
      }
    },

    onMealFoodMobileClick(
      payload:
        | { mealIndex: number; name: string; foods: FoodState[]; entity: 'meal' }
        | { foodIndex: number; mealIndex: number; name: string; entity: 'food' }
    ) {
      if (payload.entity === 'meal')
        this.onMealMobileClick(payload.mealIndex, payload.name, payload.foods);
      if (payload.entity === 'food')
        this.onFoodMobileClick(payload.foodIndex, payload.mealIndex, payload.name);
    },

    onMealMobileClick(mealIndex: number, name: string, foods: FoodState[]) {
      this.activeMeal = name;
      this.mobileMealFoodContextMenu.foodContext = false;
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
      this.mobileMealFoodContextMenu.mealIndex = mealIndex;
    },

    onFoodMobileClick(foodIndex: number, mealIndex: number, name: string) {
      this.activeFood = name;
      this.mobileMealFoodContextMenu.foodContext = true;
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
      this.mobileMealFoodContextMenu.mealIndex = mealIndex;
      this.mobileMealFoodContextMenu.foodIndex = foodIndex;
    },

    onMobileMealFoodContextMenu() {
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
