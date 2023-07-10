<template>
  <v-row class="pt-0" justify="center" :no-gutters="isMobile">
    <recall-bread-crumbs
      v-if="promptName"
      v-bind="{ meals, promptName, selection }"
    ></recall-bread-crumbs>
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
    <v-col class="pa-0" cols="12">
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

    <v-col
      v-if="showMealList && !hasFinished && meals.length"
      class="meal-list-mobile__wrap"
      cols="12"
    >
      <meal-list-mobile v-bind="{ meals }" @action="action"></meal-list-mobile>
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
      @action="action"
      @close="closeMealContextMenu(false)"
      @continue="closeMealContextMenu(true)"
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

import { MealListMobile } from '../layouts';
import FoodMobileContextMenu from './mobile/FoodMobileContextMenu.vue';
import MealMobileContextMenu from './mobile/MealMobileContextMenu.vue';
import recallMixin from './recall-mixin';

export default defineComponent({
  name: 'RecallMobile',

  components: {
    MealListMobile,
    FoodMobileContextMenu,
    MealMobileContextMenu,
  },

  mixins: [recallMixin],

  data() {
    return {
      foodContextMenu: {
        show: false,
        foodId: '0',
      },
      mealContextMenu: {
        show: false,
        mealId: '0',
      },
      alert: false,
    };
  },

  methods: {
    async onBottomListMealSelected() {
      await this.nextPrompt();
    },

    onMealContextMenu(ev: { mealId: string }) {
      this.mealContextMenu.mealId = ev.mealId;
      this.mealContextMenu.show = true;
    },

    onFoodContextMenu(ev: { foodId: string }) {
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
.meal-list-mobile__wrap {
  position: fixed;
  bottom: 56px;
  left: 0;
  width: 100%;
  z-index: 4;
}
</style>
