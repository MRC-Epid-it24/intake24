<template>
  <v-row class="pt-2" justify="center" :no-gutters="isNotDesktop">
    <v-col v-if="showMealList" cols="3" height="45rem" lg="3" min-height="30rem">
      <meal-list
        :meals="meals"
        :survey-id="surveyId"
        :survey-name="surveyName"
        @food-selected="onFoodSelected"
        @meal-action="onMealAction"
        @meal-selected="onMealSelected"
        @recall-action="onRecallAction"
      >
      </meal-list>
    </v-col>

    <v-col class="content mt-0" cols="12" lg="9">
      <recall-bread-crumbs
        v-if="showMealList && currentPrompt"
        :prompt-name="currentPrompt.prompt.props.name"
        @restart="restart"
      ></recall-bread-crumbs>
      <transition mode="out-in" name="component-fade">
        <!-- FIXME: Random key is a hacky way to force Vue to re-create the dynamic component on prompt switch
        even if the next prompt uses the same component type, probably should be something like an internal counter,
        or maybe not  ¯\_(ツ)_/¯  -->
        <component
          :is="handlerComponent"
          v-if="currentPrompt && !hideCurrentPrompt"
          :key="Math.random()"
          ref="promptHandle"
          :prompt-component="currentPrompt.prompt.component"
          :prompt-id="currentPrompt.prompt.id"
          :prompt-props="currentPrompt.prompt.props"
          @complete="onComplete"
          @continue="onContinue"
          @restart="restart"
          @validation-update="onValidationUpdate"
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

import RecallBreadCrumbs from '@intake24/survey/components/recall/BreadCrumbs.vue';
import MealList from '@intake24/survey/components/recall/MealListDesktop.vue';

import Recall from './recall';

export default defineComponent({
  name: 'DynamicRecallDesktop',

  components: { MealList, RecallBreadCrumbs },

  mixins: [Recall],

  methods: {
    onValidationUpdate(answerValid: boolean) {
      this.continueButtonEnabled = answerValid;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
