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
        :prompt-name="currentPrompt.prompt.props.name ?? { en: 'WARNING: Untitled prompt!' }"
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
          @valid="updateValidation"
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
import { defineComponent, ref } from 'vue';

import type { RecallPromptHandler } from '@intake24/common/types';
import RecallBreadCrumbs from '@intake24/survey/components/recall/BreadCrumbs.vue';
import MealList from '@intake24/survey/components/recall/MealListDesktop.vue';

import recallMixin from './recall-mixin';

export default defineComponent({
  name: 'RecallDesktop',

  components: { MealList, RecallBreadCrumbs },

  mixins: [recallMixin],

  setup() {
    const promptHandle = ref<RecallPromptHandler>();

    return { promptHandle };
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
