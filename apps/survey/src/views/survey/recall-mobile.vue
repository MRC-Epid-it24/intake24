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
        <span class="alert-text"> Alert text placeholder </span>
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
          @food-context-menu="onFoodContextMenu"
          @meal-context-menu="onMealContextMenu"
          @resetPromptTrigger="resetTrigger"
          @restart="restart"
          @valid="updateValidation"
        ></component>
      </transition>
    </v-col>

    <v-col v-if="bottomNavTab === 1" class="content" cols="12" lg="9">
      <review :active-meal-index="mealIndex" :meals="meals" :survey-name="surveyName"></review>
    </v-col>

    <v-col v-show="showMealList && bottomNavTab === 2" class="stickybottom" cols="12">
      <meal-list-mobile-bottom
        v-show="meals.length > 0"
        @meal-selected="onBottomListMealSelected"
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
    <food-mobile-context-menu
      :food-id="foodContextMenu.foodId"
      :show="foodContextMenu.show"
      @close="closeFoodContextMenu(false)"
      @continue="closeFoodContextMenu(true)"
    ></food-mobile-context-menu>

    <meal-mobile-context-menu
      :meal-id="mealContextMenu.mealId"
      :show="mealContextMenu.show"
      @close="closeMealContextMenu(false)"
      @continue="closeMealContextMenu(true)"
      @meal-action="onContextMenuMealAction"
    ></meal-mobile-context-menu>

    <info-alert
      :info="undo ? 'Undo deletion of ' + undo.type : ''"
      :status="undo ? true : false"
      @alert-dismissed="clearUndo"
    ></info-alert>
  </v-row>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { defineComponent, ref } from 'vue';

import type { RecallPromptHandler } from '@intake24/common/types';
import type { MealAction } from '@intake24/survey/components/recall/MealItem.vue';
import FoodMobileContextMenu from '@intake24/survey/components/recall/FoodMobileContextMenu.vue';
import MealMobileContextMenu from '@intake24/survey/components/recall/MealMobileContextMenu.vue';
import BottomNavigationMobile from '@intake24/survey/components/recall/mobile/BottomNavMobile.vue';
import RecallBreadCrumbsMobile from '@intake24/survey/components/recall/mobile/BreadCrumbsMobile.vue';
import FoodListMobileBottom from '@intake24/survey/components/recall/mobile/FoodListMobileBottom.vue';
import MealListMobileBottom from '@intake24/survey/components/recall/mobile/MealListMobileBottom.vue';
import Review from '@intake24/survey/components/recall/mobile/review/Review.vue';
import { useSurvey } from '@intake24/survey/stores';

import Recall from './recall';

export default defineComponent({
  name: 'RecallMobile',

  components: {
    Review,
    MealListMobileBottom,
    FoodListMobileBottom,
    RecallBreadCrumbsMobile,
    BottomNavigationMobile,
    FoodMobileContextMenu,
    MealMobileContextMenu,
  },

  mixins: [Recall],

  setup() {
    const bottomNavMobile = ref<InstanceType<typeof BottomNavigationMobile>>();
    const promptHandle = ref<RecallPromptHandler>();

    return { bottomNavMobile, promptHandle };
  },

  data() {
    return {
      bottomNavTab: 2,
      foodContextMenu: {
        show: false,
        foodId: 0,
      },
      mealContextMenu: {
        show: false,
        mealId: 0,
      },
      alert: false,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedFoodOptional', 'selectedMealOptional']),

    selectedFoodId(): number | undefined {
      return this.selectedFoodOptional?.id;
    },

    selectedMealId(): number | undefined {
      return this.selectedMealOptional?.id;
    },
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

    onContextMenuMealAction(payload: { action: MealAction; mealId: number }) {
      this.onMealAction(payload);

      if (this.bottomNavMobile) this.bottomNavMobile.tabIndex = 2;
    },

    onBottomListMealSelected() {
      if (this.bottomNavMobile) this.bottomNavMobile.tabIndex = 2;
      this.nextPrompt();
    },

    resetTrigger() {
      this.submitTrigger = false;
      console.log('Trigger Reseted', this.submitTrigger);
    },

    onMealContextMenu(ev: { mealId: number }) {
      this.mealContextMenu.mealId = ev.mealId;
      this.mealContextMenu.show = true;
    },

    onFoodContextMenu(ev: { foodId: number }) {
      this.foodContextMenu.foodId = ev.foodId;
      this.foodContextMenu.show = true;
    },

    closeFoodContextMenu(showNextPrompt: boolean) {
      this.foodContextMenu.show = false;
      if (showNextPrompt) this.contextMenuNextPrompt();
    },

    closeMealContextMenu(showNextPrompt: boolean) {
      this.mealContextMenu.show = false;
      if (showNextPrompt) this.contextMenuNextPrompt();
    },

    contextMenuNextPrompt() {
      if (this.bottomNavMobile) this.bottomNavMobile.tabIndex = 2;
      this.clearSavedState();
      this.nextPrompt();
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
