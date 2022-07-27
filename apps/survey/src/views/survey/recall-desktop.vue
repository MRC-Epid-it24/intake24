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
          v-if="currentPrompt"
          :is="handlerComponent"
          ref="promptHandle"
          :promptComponent="currentPrompt.prompt.component"
          :promptId="currentPrompt.prompt.id"
          :promptProps="currentPrompt.prompt.props"
          :key="Math.random()"
          @validation-update="onValidationUpdate"
          @continue="onContinue"
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
import CustomPromptHandler from '@intake24/survey/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import MealListDesktop from '@intake24/survey/components/recall/MealListDesktop.vue';
import RecallBreadCrumbs from '@intake24/survey/components/recall/BreadCrumbs.vue';
import InfoAlert from '@intake24/survey/components/elements/InfoAlert.vue';
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
    };
  },

  methods: {
    async onContinue() {
      this.continueButtonEnabled = false;
      await this.promptHandle?.commitAnswer();
      await this.nextPrompt();
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
