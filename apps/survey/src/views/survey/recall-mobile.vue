<template>
  <v-row :no-gutters="isMobile" class="pt-2" justify="center">
    <recall-bread-crumbs-mobile :promptName="activePrompt"></recall-bread-crumbs-mobile>
    <transition type="fade" mode="out-in">
      <v-alert
        elevation="2"
        transition="slide-x-reverse-transition"
        dense
        color="bisque"
        border="left"
        type="warning"
        class="alert ma-2"
        :value="alert"
      >
        <span class="alert-text">
          I'm a dense alert placeholder with the <strong>border</strong> prop and a
          <strong>type</strong> of warning
        </span>
      </v-alert>
    </transition>
    <v-col cols="12" lg="9" class="content" v-if="bottomNavTab !== 1">
      <transition name="component-fade" mode="out-in">
        <!-- FIXME: Random key is a hacky way to force Vue to re-create the dynamic component on prompt switch
        even if the next prompt uses the same component type, probably should be something like an internal counter,
        or maybe not  ¯\_(ツ)_/¯  -->

        <component
          v-if="currentPrompt"
          :is="handlerComponent"
          ref="promptHandle"
          :promptComponent="currentPrompt.prompt.component"
          :promptId="currentPrompt.prompt.id"
          :promptProps="currentPrompt.prompt.props"
          :key="Math.random()"
          :submitTrigger="submitTrigger"
          @completion-update="onCompletionUpdate"
          @complete="onComplete"
          @resetPromptTrigger="resetTrigger"
          @meal-food-selected="onMealFoodMobileClick"
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
        @meal-selected="onMealFoodMobileClick"
        @recall-action="onRecallAction"
      >
      </meal-list-mobile-bottom>
    </v-col>

    <transition type="fade">
      <bottom-navigation-mobile
        v-if="showMealList"
        @navigation-item-click="onBottomNavChange"
        :continue-button-enabled="continueButtonEnabled"
      />
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
      @complete="onComplete"
    ></meal-food-mobile-context-menu>

    <info-alert
      :status="undo ? true : false"
      :info="undo ? 'Undo deletion of ' + undo.type : ''"
      @alert-dismissed="clearUndo"
    ></info-alert>
  </v-row>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import type { FoodState } from '@intake24/common/types';
import MealListMobileBottom from '@intake24/survey/components/recall/mobile/MealListMobileBottom.vue';
import FoodListMobileBottom from '@intake24/survey/components/recall/mobile/FoodListMobileBottom.vue';
import RecallBreadCrumbsMobile from '@intake24/survey/components/recall/mobile/BreadCrumbsMobile.vue';
import MealFoodMobileContextMenu from '@intake24/survey/components/recall/MobileMealFoodContext.vue';

import CustomPromptHandler from '@intake24/survey/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import BottomNavigationMobile from '@intake24/survey/components/recall/mobile/BottomNavMobile.vue';
import Review from '@intake24/survey/components/recall/mobile/review/Review.vue';
import Recall from './recall';

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
      continueButtonEnabled: false,
      bottomNavTab: 2,
      mobileMealFoodContextMenu: {
        show: false,
        mealIndex: 0,
        foodIndex: 0,
        foodContext: false,
      },
      submitTrigger: false,
      alert: false,
    };
  },

  computed: {
    ...mapState(useSurvey, [
      'selectedMeal',
      'selectedFood',
      'selectedMealIndex',
      'selectedFoodIndex',
      'currentTempPromptAnswer',
    ]),
  },

  methods: {
    // FIXME: Should use nested router for this
    onBottomNavChange(tab: number) {
      if (tab === 0) {
        this.onRecallAction('add-meal');
      } else if (tab === 1) {
        this.onRecallAction('review-confirm');
      } else if (tab === 2) {
        this.onComplete();
      }
    },

    resetTrigger() {
      this.submitTrigger = false;
      console.log('Trigger Reseted', this.submitTrigger);
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

    onComplete() {
      this.$refs.promptHandle.commitAnswer();
      this.continueButtonEnabled = false;
      this.nextPrompt();
    },

    onCompletionUpdate(promptComplete: boolean) {
      this.continueButtonEnabled = promptComplete;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
