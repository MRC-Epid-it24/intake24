<template>
  <v-row>
    <v-col>
      <v-expansion-panels v-model="panelOpenId">
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.common.completeBelow') }}
            <template v-slot:actions>
              <valid-invalid-icon :valid="foodSearchComplete"></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <food-search-prompt
              :prompt-props="searchTestPromptProps"
              :initial-search-term="genericName"
              @food-selected="selectFood($event)"
            ></food-search-prompt>
            <v-btn>{{ $t('portion.milkCereal.foodSelectButton') }}</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Option select portion method (if applicable)
            <template v-slot:actions>
              <valid-invalid-icon :valid="portionMethodSelected"></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <portion-size-option-prompt
              :promptProps="portionOptionProps"
              :foodName="selectedFoodData.localDescription"
              :availableMethods="selectedFoodData.portionSizeMethods"
              @option-selected="selectPortionMethod($event)"
            ></portion-size-option-prompt>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Select how much {associated food} you had:
            <template v-slot:actions>
              <valid-invalid-icon :valid="portionSelected"></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ selectedMethodData }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { merge } from '@common/util';
import { UserFoodData, UserPortionSizeMethod } from '@common/types/http';
import {
  AssociatedFoodsPanelProps,
  associatedFoodPanelDefaultProps,
  FoodSearchPromptProps,
  BasePromptProps,
} from '@common/prompts';
import { LocaleTranslation } from '@common/types';
import BaseExpansionPortion, { ExpansionPortion } from './BaseExpansionPortion';
import FoodSearchPrompt from '@/components/prompts/standard/FoodSearchPrompt.vue';
import PortionSizeOptionPrompt from '@/components/prompts/portion/PortionSizeOptionPrompt.vue';

export default (Vue as VueConstructor<Vue & ExpansionPortion>).extend({
  name: 'AssociatedFoodPanel',

  components: {
    FoodSearchPrompt,
    PortionSizeOptionPrompt,
  },

  mixins: [BaseExpansionPortion],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => AssociatedFoodsPanelProps,
    },
    // assocPromptData: {
    //   type: Object as () => UserAssociatedFoodPrompt,
    // },
  },

  data() {
    return {
      ...merge(associatedFoodPanelDefaultProps, this.promptProps),
      errors: [] as string[],
      validPanels: [] as any,
      // Below are rough/testing vars to control UI prototype
      bowlType: 'A' as string, // For testing until food linking
      foodSearchComplete: false as boolean,
      selectedFoodData: {} as UserFoodData,
      portionMethodSelected: false as boolean,
      selectedMethodData: {} as UserPortionSizeMethod,
      portionMethodValue: '' as string,
      portionSelected: false as boolean,
      portionValue: '' as string,
      imageMapId: 'milkbowlA',
      imageMapData: [] as any,
      imageMapLoaded: false as boolean,
      // If MCRL (milk_in_cereal) associated food category is triggered, we will wind up here
      // Associated_foods contains `text` field which is the question
      // Testing props for the food search
      searchTestPromptProps: {
        allowBrowsing: true,
        dualLanguage: true,
        text: { en: '' },
        description: { en: '' },
        conditions: [],
      } as FoodSearchPromptProps,
      assocFoodDescription: '',
      portionOptionProps: {
        text: { en: '' },
        description: { en: '' },
      } as BasePromptProps,
    };
  },

  computed: {
    localeDescription(): string | null {
      // return this.getLocaleContent(this.description);
      return 'computed locale description TODO';
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    genericName(): string | null {
      if (this.promptProps.assocPromptData) {
        return this.promptProps.assocPromptData.genericName;
      }
      return null;
    },
    isValid(): boolean {
      if (this.foodSearchComplete && this.portionMethodSelected && this.portionSelected) {
        return true;
      }
      return false;
    },
  },

  mounted() {
    // this.validPanels = new Array<boolean>(this.expansionPanelTotal);
    if (this.promptProps.assocPromptData) {
      // Note: this is not translation safe as hard encoding the locale here
      const promptTitle: LocaleTranslation = {
        en: this.$t('portion.associatedFoods.searchLabel', { food: this.genericName }) as string,
      };
      this.searchTestPromptProps.text = promptTitle;
    }
  },

  methods: {
    async fetchImageMapData() {
      try {
        const { data } = await this.$http.get(`portion-sizes/image-maps/${this.imageMapId}`);
        this.imageMapData = { ...data };
        this.imageMapLoaded = true;
      } catch (e) {
        console.log(e);
      }
    },
    // setDisplayQuestions(value: boolean) {
    //   this.displayQuestions = value;
    // },
    selectFood(value: UserFoodData) {
      this.selectedFoodData = value;
      this.foodSearchComplete = true;
      this.setPanelOpen(1);
      this.submit();
    },
    selectPortionMethod(value: number) {
      this.portionMethodSelected = true;
      // PortionOption emits the # of option selected. Look this up then pass to portion method
      console.log(value, this.selectedFoodData.portionSizeMethods[value]);
      this.selectedMethodData = this.selectedFoodData.portionSizeMethods[value];
      this.setPanelOpen(2);
      if (!this.imageMapLoaded) {
        this.fetchImageMapData();
      }
      this.submit();
    },
    selectPortion() {
      this.portionSelected = true;
      this.setPanelOpen(-1);
      this.submit();
    },
    submit() {
      if (this.isValid) {
        this.$emit('associated-done');
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
