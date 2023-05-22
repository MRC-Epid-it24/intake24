<template>
  <v-row class="pt-2" justify="center" :no-gutters="isMobile">
    <v-col v-if="showMealList && surveyName" cols="3">
      <meal-list
        v-bind="{ meals, surveyName }"
        @action="action"
        @food-selected="foodSelected"
        @meal-selected="mealSelected"
      >
      </meal-list>
    </v-col>
    <v-col :cols="showMealList ? 8 : 9">
      <recall-bread-crumbs
        v-if="promptName"
        v-bind="{ meals, promptName, selection }"
      ></recall-bread-crumbs>
      <transition mode="out-in" name="component-fade">
        <component
          :is="handlerComponent"
          v-if="currentPrompt && !hideCurrentPrompt"
          :key="handlerKey"
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

import { MealList, RecallBreadCrumbs } from '../layouts';
import recallMixin from './recall-mixin';

export default defineComponent({
  name: 'RecallDesktop',

  components: { MealList, RecallBreadCrumbs },

  mixins: [recallMixin],
});
</script>

<style lang="scss" scoped></style>
