<template>
  <v-row class="pt-0" justify="center" :no-gutters="isMobile">
    <recall-bread-crumbs-mobile :prompt-name="activePrompt"></recall-bread-crumbs-mobile>
    <transition mode="out-in" type="fade">
      <v-alert
        border="left"
        class="alert ma-2"
        color="bisque"
        dense
        elevation="2"
        transition="slide-x-reverse-transition"
        type="warning"
        :value="alert"
      >
        <span class="alert-text">
          I'm a dense alert placeholder with the <strong>border</strong> prop and a
          <strong>type</strong> of warning
        </span>
      </v-alert>
    </transition>
    <v-col v-if="bottomNavTab !== 1" class="content mt-0 pa-0" cols="12" lg="9">
      <transition mode="out-in" name="component-fade">
        <!-- FIXME: Random key is a hacky way to force Vue to re-create the dynamic component on prompt switch
        even if the next prompt uses the same component type, probably should be something like an internal counter,
        or maybe not  ¯\_(ツ)_/¯  -->

        <component
          :is="handlerComponent"
          v-if="currentPrompt"
          :key="Math.random()"
          ref="promptHandle"
          :prompt-component="currentPrompt.prompt.component"
          :prompt-id="currentPrompt.prompt.id"
          :prompt-props="currentPrompt.prompt.props"
          :submit-trigger="submitTrigger"
          @complete="onComplete"
          @continue="onContinue"
          @meal-food-selected="onMealFoodMobileClick"
          @resetPromptTrigger="resetTrigger"
          @restart="restart"
          @validation-update="onValidationUpdate"
        ></component>
      </transition>
    </v-col>

    <v-col v-if="bottomNavTab === 1" class="content" cols="12" lg="9">
      <review :active-meal-index="mealIndex" :meals="meals" :survey-name="surveyName"></review>
    </v-col>

    <v-col v-show="showMealList && bottomNavTab === 2" class="stickybottom" cols="12">
      <meal-list-mobile-bottom
        v-show="meals.length > 0"
        :meals="meals"
        @meal-selected="onMealFoodMobileClick"
        @recall-action="onRecallAction"
      >
      </meal-list-mobile-bottom>
    </v-col>

    <transition type="fade">
      <bottom-navigation-mobile
        v-if="showMealList"
        ref="bottomNavMobile"
        :continue-button-enabled="continueButtonEnabled"
        @navigation-item-click="onBottomNavChange"
      />
    </transition>

    <!-- Context menu for Meal or Food with actions options -->
    <meal-food-mobile-context-menu
      :entity-id="
        mobileMealFoodContextMenu.foodContext
          ? mobileMealFoodContextMenu.foodId
          : mobileMealFoodContextMenu.mealId
      "
      :entity-name="mobileMealFoodContextMenu.foodContext ? activeFood : activeMeal"
      :entity-type="mobileMealFoodContextMenu.foodContext"
      :show="mobileMealFoodContextMenu.show"
      @continue="onContinue"
      @meal-action="onMealActionMobile"
      @toggleMobileMealContext="onMobileMealFoodContextMenu"
    ></meal-food-mobile-context-menu>

    <info-alert
      :info="undo ? 'Undo deletion of ' + undo.type : ''"
      :status="undo ? true : false"
      @alert-dismissed="clearUndo"
    ></info-alert>
  </v-row>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodState } from '@intake24/common/types';
import type { MealAction } from '@intake24/survey/components/recall/MealItem.vue';
import BottomNavigationMobile from '@intake24/survey/components/recall/mobile/BottomNavMobile.vue';
import RecallBreadCrumbsMobile from '@intake24/survey/components/recall/mobile/BreadCrumbsMobile.vue';
import FoodListMobileBottom from '@intake24/survey/components/recall/mobile/FoodListMobileBottom.vue';
import MealListMobileBottom from '@intake24/survey/components/recall/mobile/MealListMobileBottom.vue';
import Review from '@intake24/survey/components/recall/mobile/review/Review.vue';
import MealFoodMobileContextMenu from '@intake24/survey/components/recall/MobileMealFoodContext.vue';
import { useSurvey } from '@intake24/survey/stores';

import Recall from './recall';

export default defineComponent({
  name: 'RecallMobile',

  components: {
    Review,
    MealListMobileBottom,
    FoodListMobileBottom,
    RecallBreadCrumbsMobile,
    MealFoodMobileContextMenu,
    BottomNavigationMobile,
  },

  mixins: [Recall],

  data() {
    return {
      bottomNavTab: 2,
      mobileMealFoodContextMenu: {
        show: false,
        mealId: 0,
        foodId: 0,
        foodContext: false,
      },
      alert: false,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedFoodOptional', 'selectedMealOptional']),
  },

  methods: {
    // FIXME: Should use nested router for this
    onBottomNavChange(tab: number) {
      if (tab === 0) {
        this.onRecallAction('add-meal');
      } else if (tab === 1) {
        this.onRecallAction('review-confirm');
      } else if (tab === 2) {
        this.onContinue();
      }
    },

    onMealActionMobile(payload: { action: MealAction; mealId: number }) {
      this.onMealAction(payload);
      this.$refs.bottomNavMobile.tabIndex = 2;
    },

    resetTrigger() {
      this.submitTrigger = false;
      console.log('Trigger Reseted', this.submitTrigger);
    },

    onMealFoodMobileClick(
      payload:
        | { mealId: number; name: string; foods: FoodState[]; entity: 'meal' }
        | { foodId: number; name: string; entity: 'food' }
    ) {
      if (payload.entity === 'meal')
        this.onMealMobileClick(payload.mealId, payload.name, payload.foods);
      if (payload.entity === 'food') this.onFoodMobileClick(payload.foodId, payload.name);
    },

    onMealMobileClick(mealId: number, name: string, foods: FoodState[]) {
      this.activeMeal = name;
      this.mobileMealFoodContextMenu.foodContext = false;
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
      this.mobileMealFoodContextMenu.mealId = mealId;
    },

    onFoodMobileClick(foodId: number, name: string) {
      this.activeFood = name;
      this.mobileMealFoodContextMenu.foodContext = true;
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
      this.mobileMealFoodContextMenu.foodId = foodId;
    },

    onMobileMealFoodContextMenu() {
      this.mobileMealFoodContextMenu.show = !this.mobileMealFoodContextMenu.show;
    },

    onValidationUpdate(answerValid: boolean) {
      this.continueButtonEnabled = answerValid;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
