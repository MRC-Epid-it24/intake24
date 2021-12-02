<template>
  <v-row justify="center" class="pt-2">
    <v-col v-if="showMealList" cols="3" lg="3" min-height="30rem" height="45rem">
      <meal-list
        :surveyName="surveyName"
        :surveyId="surveyId"
        :meals="meals"
        @meal-action="onMealAction"
        @recall-action="onRecallAction"
        @food-selected="onFoodSelected"
      >
      </meal-list>
    </v-col>

    <v-col cols="12" lg="9" class="content">
      <recall-bread-crumbs v-if="showMealList" :promptName="activePrompt"></recall-bread-crumbs>
      <transition name="component-fade" mode="out-in">
        <!-- FIXME: Random key is a hacky way to force Vue to re-create the dynamic component on prompt switch
        even if the next prompt uses the same component type, probably should be something like an internal counter,
        or maybe not  ¯\_(ツ)_/¯  -->
        <component
          v-if="currentPrompt"
          :is="handlerComponent"
          :promptComponent="currentPrompt.prompt.component"
          :promptId="currentPrompt.prompt.id"
          :promptProps="currentPrompt.prompt.props"
          :key="Math.random()"
          @complete="nextPrompt"
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
import Recall from './recall';
import CustomPromptHandler from '@/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import MealListDesktop from '@/components/recall/MealListDesktop.vue';
import RecallBreadCrumbs from '@/components/recall/BreadCrumbs.vue';
import InfoAlert from '@/components/elements/InfoAlert.vue';

export default Recall.extend({
  name: 'DynamicRecallDesktop',

  components: {
    MealListDesktop,
    RecallBreadCrumbs,
    CustomPromptHandler,
    InfoAlert,
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
