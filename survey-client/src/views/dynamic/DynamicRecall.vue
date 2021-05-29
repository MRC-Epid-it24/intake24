<template>
  <v-row justify="center" class="pa-0">
    <v-col cols="12" class="mealbar" v-if="isNotDesktop && showMealList">
      <meal-list-mobile-top :foods="foods" :meals="meals"> </meal-list-mobile-top>
    </v-col>
    <v-col v-if="!isNotDesktop && showMealList" cols="3" lg="3" min-height="30rem" height="45rem">
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

    <v-col cols="12" lg="9" class="content after_stickytop">
      <recall-bread-crumbs v-if="showMealList && !isNotDesktop"></recall-bread-crumbs>
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
import RecallBreadCrumbs from '@/components/recall/BreadCrumbs.vue';
import MealList, { RecallAction } from '@/components/recall/MealListDesktop.vue';
import { MealSection, MealState, Selection, SurveyQuestionSection } from '@common/types';
import { ComponentType } from '@common/prompts';
import { mapState } from 'vuex';
import CustomPromptHandler from '@/components/prompts/dynamic/handlers/CustomPromptHandler.vue';
import standardHandlers from '@/components/prompts/dynamic/handlers/standard';
import portionSizeHandlers from '@/components/prompts/dynamic/handlers/portion-size';
import timeDoubleDigitsConvertor from '@/components/mixins/timeDoubleDigitsConvertor';
import { MealAction } from '@/components/recall/MealItem.vue';

export default Vue.extend({
  name: 'DynamicRecall',

  components: {
    MealListMobileBottom,
    MealListMobileTop,
    MealList,
    RecallBreadCrumbs,
    CustomPromptHandler,
    ...standardHandlers,
    ...portionSizeHandlers,
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
        case 'portion-size':
          return `${prompt.component}-handler`;
        default:
          throw new Error(`Unexpected prompt type: ${prompt.type}`);
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
      // FIXME: decide on where to put prompts that are not connected to the main flow or refactor this.
      return (
        this.currentPrompt?.section !== 'preMeals' ||
        this.currentPrompt.prompt.component === 'meal-add-prompt'
      );
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
        return state.survey.data.meals.map((meal: MealState) => {
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
    setSelection(newSelection: Selection) {
      // Prevent the currently active prompt from crashing if it expects a different selection type
      this.currentPrompt = null;
      this.$store.commit('survey/setSelection', newSelection);
    },

    showMealPrompt(mealIndex: number, promptSection: MealSection, promptType: ComponentType) {
      this.setSelection({
        element: {
          type: 'meal',
          mealIndex,
        },
        mode: 'manual',
      });

      const prompt = this.recallController
        ? this.recallController.promptManager.findMealPromptOfType(promptType, promptSection)
        : undefined;

      if (prompt === undefined)
        throw new Error(
          `Survey scheme is missing required meal (preFoods) prompt of type ${promptType}`
        );

      this.currentPrompt = {
        section: promptSection,
        prompt,
      };
    },

    showSurveyPrompt(promptSection: SurveyQuestionSection, promptType: ComponentType) {
      this.setSelection({
        element: null,
        mode: 'manual',
      });

      const prompt = this.recallController
        ? this.recallController.promptManager.findSurveyPromptOfType(promptType, promptSection)
        : undefined;

      if (prompt === undefined)
        throw new Error(
          `Survey scheme is missing required survey (preMeals) prompt of type ${promptType}`
        );

      this.currentPrompt = {
        section: promptSection,
        prompt,
      };
    },

    onMealAction(payload: { action: MealAction; mealIndex: number }) {
      // eslint-disable-next-line default-case
      switch (payload.action) {
        case 'edit-foods':
          this.showMealPrompt(payload.mealIndex, 'preFoods', 'edit-meal-prompt');
          break;
        case 'edit-time':
          this.showMealPrompt(payload.mealIndex, 'preFoods', 'meal-time-prompt');
          break;
      }
    },

    onRecallAction(action: RecallAction) {
      // eslint-disable-next-line default-case
      switch (action) {
        case 'add-meal':
          this.showSurveyPrompt('preMeals', 'meal-add-prompt');
          break;
      }
    },

    async onFoodSelected(payload: { mealIndex: number; foodIndex: number }) {
      this.setSelection({
        element: {
          type: 'food',
          mealIndex: payload.mealIndex,
          foodIndex: payload.foodIndex,
        },
        mode: 'manual',
      });

      await this.nextPrompt();
    },

    async nextPrompt() {
      const nextPrompt = this.recallController ? this.recallController.getNextPrompt() : undefined;

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
<style lang="scss" scoped>
@import '../../scss/meallistmobile2.scss';
</style>
