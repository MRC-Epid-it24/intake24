<template>
  <v-row class="pt-0" justify="center" :no-gutters="isMobile">
    <recall-bread-crumbs-mobile
      v-if="promptName"
      :prompt-name="promptName"
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
          :key="handlerKey"
          :prompt="currentPrompt.prompt"
          @action="action"
          @food-context-menu="onFoodContextMenu"
          @meal-context-menu="onMealContextMenu"
        ></component>
      </transition>
    </v-col>

    <v-col v-show="showMealList && !hasFinished" class="stickybottom" cols="12">
      <meal-list-mobile-bottom
        v-show="meals.length"
        @meal-selected="onBottomListMealSelected"
        @recall-action="recallAction"
      >
      </meal-list-mobile-bottom>
    </v-col>

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
import { defineComponent } from 'vue';

import type { MealAction } from './recall-mixin';
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
    FoodMobileContextMenu,
    MealMobileContextMenu,
  },

  mixins: [recallMixin],

  data() {
    return {
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
    onContextMenuMealAction(payload: { type: MealAction; mealId: number }) {
      this.mealAction(payload);
    },

    async onBottomListMealSelected() {
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
      this.clearSavedState();
      await this.nextPrompt();
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
