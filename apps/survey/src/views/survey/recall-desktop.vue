<template>
  <v-row :no-gutters="isNotDesktop" class="pt-2" justify="center">
    <v-col v-if="showMealList" cols="3" lg="3" min-height="30rem" height="45rem">
      <meal-list
        :surveyName="surveyName"
        :surveyId="surveyId"
        :meals="meals"
        @meal-action="onMealAction"
        @recall-action="onRecallAction"
        @food-selected="onFoodSelected"
        @meal-selected="onMealSelected"
      >
      </meal-list>
    </v-col>

    <v-col cols="12" lg="9" class="content mt-0">
      <recall-bread-crumbs v-if="showMealList" :promptName="activePrompt"></recall-bread-crumbs>
      <transition name="component-fade" mode="out-in">
        <!-- FIXME: Random key is a hacky way to force Vue to re-create the dynamic component on prompt switch
        even if the next prompt uses the same component type, probably should be something like an internal counter,
        or maybe not  ¯\_(ツ)_/¯  -->
        <component
          v-if="currentPrompt && !hideCurrentPrompt"
          :is="handlerComponent"
          ref="promptHandle"
          :promptComponent="currentPrompt.prompt.component"
          :promptId="currentPrompt.prompt.id"
          :promptProps="currentPrompt.prompt.props"
          :key="Math.random()"
          @validation-update="onValidationUpdate"
          @complete="onComplete"
          @continue="onContinue"
          @restart="restart"
        ></component>
      </transition>
    </v-col>

    <info-alert
      :status="undo ? true : false"
      :info="undo ? 'Undo deletion of ' + undo.type : ''"
      @alert-dismissed="clearUndo"
    ></info-alert>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import InfoAlert from '@intake24/survey/components/elements/InfoAlert.vue';
import CustomPromptHandler from '@intake24/survey/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import RecallBreadCrumbs from '@intake24/survey/components/recall/BreadCrumbs.vue';
import MealListDesktop from '@intake24/survey/components/recall/MealListDesktop.vue';

import Recall from './recall';

export default defineComponent({
  name: 'DynamicRecallDesktop',

  mixins: [Recall],

  components: {
    MealListDesktop,
    RecallBreadCrumbs,
    CustomPromptHandler,
    InfoAlert,
  },

  data: () => {
    return {
      continueButtonEnabled: false,
      submitTrigger: false,
      hideCurrentPrompt: false,
    };
  },

  methods: {
    async onContinue() {
      this.continueButtonEnabled = false;

      // Workaround for a crash that occurs if the currently selected prompt changes something
      // in the recall data that makes it incompatible, for example changing from 'free-text'
      // food entry type to 'encoded-food' in commitAnswer.
      //
      // In the current implementation an update/render event is triggered before the nextPrompt
      // function is executed, because most prompts have a reactive dependency on the currently
      // selected food.
      //
      // The correct implementation would be re-evaluating the current prompt type immediately
      // (via the reactivity system) in response to changes in commitAnswer.
      this.hideCurrentPrompt = true;

      await this.promptHandle?.commitAnswer();
      await this.nextPrompt();

      this.hideCurrentPrompt = false;
    },

    // Same as onContinue but don't commit, for alternative prompt actions such as delete meal
    async onComplete() {
      this.continueButtonEnabled = false;
      this.hideCurrentPrompt = true;

      await this.nextPrompt();

      this.hideCurrentPrompt = false;
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
