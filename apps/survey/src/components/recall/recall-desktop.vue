<template>
  <v-row class="pt-2" justify="center" :no-gutters="isNotDesktop">
    <v-col v-if="showMealList" cols="3" height="45rem" lg="3" min-height="30rem">
      <meal-list
        :meals="meals"
        :survey-name="surveyName"
        @action="recallAction"
        @food-selected="foodSelected"
        @meal-action="mealAction"
        @meal-selected="mealSelected"
      >
      </meal-list>
    </v-col>

    <v-col class="content mt-0" cols="12" lg="9">
      <recall-bread-crumbs
        v-if="showMealList && promptName"
        :prompt-name="promptName"
        @restart="restart"
      ></recall-bread-crumbs>
      <transition mode="out-in" name="component-fade">
        <component
          :is="handlerComponent"
          v-if="currentPrompt && !hideCurrentPrompt"
          :key="currentPrompt.prompt.id"
          :prompt="currentPrompt.prompt"
          @action="action"
        ></component>
      </transition>
    </v-col>

    <info-alert
      :info="undo ? 'Undo deletion of ' + undo.type : ''"
      :status="undo ? true : false"
      @alert-dismissed="clearUndo"
    ></info-alert>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import RecallBreadCrumbs from './BreadCrumbs.vue';
import MealList from './MealList.vue';
import recallMixin from './recall-mixin';

export default defineComponent({
  name: 'RecallDesktop',

  components: { MealList, RecallBreadCrumbs },

  mixins: [recallMixin],
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
