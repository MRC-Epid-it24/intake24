<template>
  <v-row class="pt-0" justify="center" :no-gutters="isMobile">
    <recall-bread-crumbs-mobile
      :prompt-name="activePrompt"
      @restart="restart"
    ></recall-bread-crumbs-mobile>
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
    <v-col class="content mt-0 pa-0" cols="12" lg="9">
      <transition mode="out-in" name="component-fade">
        <component
          :is="handlerComponent"
          v-if="currentPrompt && !hideCurrentPrompt"
          :key="currentPrompt.prompt.id"
          ref="promptHandle"
          :prompt-component="currentPrompt.prompt.component"
          :prompt-id="currentPrompt.prompt.id"
          :prompt-props="currentPrompt.prompt.props"
          @complete="complete"
          @continue="onContinue"
          @food-context-menu="onFoodContextMenu"
          @meal-context-menu="onMealContextMenu"
          @restart="restart"
          @valid="updateValidation"
        ></component>
      </transition>
    </v-col>

    <v-col v-show="showMealList" class="stickybottom" cols="12">
      <meal-list-mobile-bottom
        v-show="meals.length"
        @meal-selected="onBottomListMealSelected"
        @recall-action="recallAction"
      >
      </meal-list-mobile-bottom>
    </v-col>

    <bottom-navigation-mobile
      v-if="showMealList"
      :can-continue="continueButtonEnabled"
      :tab.sync="bottomNavTab"
      @update:tab="onBottomNavChange"
    ></bottom-navigation-mobile>

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
import { defineComponent, ref } from 'vue';

import type { RecallPromptHandler } from '@intake24/common/types';

import type { MealAction } from './recall-mixin';
import BottomNavigationMobile from './mobile/BottomNavMobile.vue';
import RecallBreadCrumbsMobile from './mobile/BreadCrumbsMobile.vue';
import FoodMobileContextMenu from './mobile/FoodMobileContextMenu.vue';
import MealListMobileBottom from './mobile/MealListMobileBottom.vue';
import MealMobileContextMenu from './mobile/MealMobileContextMenu.vue';
import recallMixin from './recall-mixin';

export default defineComponent({
  name: 'RecallMobile',

  components: {
    MealListMobileBottom,
    RecallBreadCrumbsMobile,
    BottomNavigationMobile,
    FoodMobileContextMenu,
    MealMobileContextMenu,
  },

  mixins: [recallMixin],

  setup() {
    const promptHandle = ref<RecallPromptHandler>();

    return { promptHandle };
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

  methods: {
    // FIXME: Should use nested router for this
    async onBottomNavChange(tab: number) {
      if (tab === 0) {
        this.recallAction('add-meal');
      } else if (tab === 1) {
        this.recallAction('review-confirm');
      } else if (tab === 2) {
        await this.onContinue();
      }
    },

    onContextMenuMealAction(payload: { action: MealAction; mealId: number }) {
      this.mealAction(payload);

      this.bottomNavTab = 2;
    },

    async onBottomListMealSelected() {
      this.bottomNavTab = 2;
      await this.nextPrompt();
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

    async contextMenuNextPrompt() {
      this.bottomNavTab = 2;
      this.clearSavedState();
      await this.nextPrompt();
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
