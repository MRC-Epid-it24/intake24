<template>
  <v-row justify="center" class="pa-0">
    <v-col cols="12" class="mealbar stickytop" v-if="isNotDesktop && showMealList">
      <meal-list-mobile-top :foods="foods" :meals="meals"> </meal-list-mobile-top>
    </v-col>
    <v-col v-if="!isNotDesktop && showMealList" cols="3" lg="3" min-height="30rem" height="45rem">
      <meal-list
        :surveyName="surveyName"
        :surveyId="surveyId"
        :meals="meals"
        @manual-prompt-selection="clickListHandler"
      >
      </meal-list>
    </v-col>

    <v-col cols="12" lg="9" class="content">
      <v-toolbar class="mb-4" v-if="showMealList">
        <v-breadcrumbs v-if="!isNotDesktop" :items="brdMeal" divider="/"></v-breadcrumbs>
        <v-spacer v-if="!isNotDesktop"></v-spacer>
        <v-btn @click="$router.back()"> back </v-btn>
      </v-toolbar>

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
    <v-col cols="12" class="foodbar stickybottom">
      <meal-list-mobile-bottom v-if="isNotDesktop" :loading="false" :foods="foods">
      </meal-list-mobile-bottom>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { SchemeEntryResponse, SurveyEntryResponse } from '@common/types/http';
import DynamicRecall, { PromptInstance } from '@/dynamic-recall/dynamic-recall';
import MealListMobileBottom from '@/components/recall/MealListMobileBottom.vue';
import MealListMobileTop from '@/components/recall/MealListMobileTop.vue';
import MealList from '@/components/recall/MealListDesktop.vue';
import { MealState2 } from '@common/types';
import { ComponentType } from '@common/prompts';
import { mapState } from 'vuex';
import CustomPromptHandler from '@/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import standardHandlers from '@/components/prompts/dynamic/handlers/standard';
import timeDoubleDigitsConvertor from '@/components/mixins/timeDoubleDigitsConvertor';

export default Vue.extend({
  name: 'DynamicRecall',

  components: {
    MealListMobileBottom,
    MealListMobileTop,
    MealList,
    CustomPromptHandler,
    ...standardHandlers,
  },

  data: () => {
    return {
      currentPrompt: null as PromptInstance | null,
      recallController: null as DynamicRecall | null,
      clickedPrompt: null as ComponentType | null,
    };
  },

  computed: {
    handlerComponent(): string {
      const prompt = this.currentPrompt?.prompt;

      if (prompt === undefined) throw new Error('Current prompt must be defined');

      switch (prompt.type) {
        case 'custom':
          return 'custom-prompt-handler';
        case 'standard':
          return `${prompt.component}-handler`;
        default:
          throw new Error('Not implemented');
      }
    },

    surveyScheme(): SchemeEntryResponse | null {
      return this.$store.state.survey.parameters?.scheme;
    },

    surveyName(): SurveyEntryResponse | null {
      return this.$store.state.survey.parameters?.name;
    },

    surveyId(): SurveyEntryResponse | null {
      return this.$store.state.survey.parameters?.id;
    },

    showMealList(): boolean {
      return this.currentPrompt?.section !== 'preMeals';
    },

    foods(): any {
      return [];
    },

    brdMeal(): any {
      return [
        {
          text: 'Choose Meal',
          disabled: true,
        },
        {
          text: 'Choose Food',
          disabled: true,
        },
      ];
    },

    ...mapState({
      meals: (state: any) => {
        return state.survey.data.meals.map((meal: MealState2) => {
          return {
            name: meal.name,
            time: meal.time
              ? timeDoubleDigitsConvertor(meal.time.hours)
                  .concat(':')
                  .concat(timeDoubleDigitsConvertor(meal.time.minutes))
              : ``,
            // FIXME: Foods is type of Encoded USer Food Data or Uswr Food Data. at the mpment FoodItem.vue component is expecting object iwth name and searchTerm properties.
            foods: meal.foods,
          };
        });
      },
    }),
  },

  async created() {
    if (this.surveyScheme == null) {
      console.error('Survey scheme must be known at this point');
      return;
    }

    this.recallController = new DynamicRecall(this.surveyScheme, this.$store);

    await this.recallController.initialiseSurvey();
  },

  async mounted() {
    await this.nextPrompt();
  },

  methods: {
    async clickListHandler(actionPayload: { action: string; itemId: string }) {
      console.log('Recevied from the List: ', actionPayload);
      // TODO: Choose between different types of Components
      const promptComponent: ComponentType = 'meal-add-prompt';
      const nextPrompt = this.recallController!.setCurrentPrompt(promptComponent);

      if (nextPrompt === undefined) {
        console.log('Undefined: ', nextPrompt);
        this.currentPrompt = null;
      } else {
        console.log(`Switching prompt to ${nextPrompt.prompt.component}`);
        this.currentPrompt = nextPrompt;
      }
      // await this.nextPrompt()
    },

    async nextPrompt() {
      const nextPrompt = this.recallController!.getNextPrompt();

      if (nextPrompt === undefined) {
        // TODO: handle completion
        console.log('No prompts remaining');
        this.currentPrompt = null;
      } else {
        console.log(`Switching prompt to ${nextPrompt.prompt.component}`);
        this.currentPrompt = nextPrompt;
      }
    },
  },
});
</script>
