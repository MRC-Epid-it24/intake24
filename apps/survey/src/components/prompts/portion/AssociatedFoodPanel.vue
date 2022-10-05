<template>
  <v-row>
    <v-col>
      <v-expansion-panels v-model="panelOpenId">
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.common.completeBelow') }}
            <template #actions>
              <valid-invalid-icon :valid="foodSearchComplete"></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <food-search-prompt
              :initial-search-term="genericName"
              :prompt-props="searchTestPromptProps"
              @food-selected="selectFood($event)"
            ></food-search-prompt>
            <v-btn>{{ $t('portion.milkCereal.foodSelectButton') }}</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Option select portion method (if applicable)
            <template #actions>
              <valid-invalid-icon :valid="portionMethodSelected"></valid-invalid-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <portion-size-option-prompt
              :available-methods="selectedFoodData.portionSizeMethods"
              :food-name="selectedFoodData.localDescription"
              :prompt-props="portionOptionProps"
              @option-selected="selectPortionMethod($event)"
            ></portion-size-option-prompt>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            Select how much {associated food} you had:
            <template #actions>
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
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  AssociatedFoodsPanelProps,
  BasePromptProps,
  FoodSearchPromptProps,
} from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';
import type { UserFoodData, UserPortionSizeMethod } from '@intake24/common/types/http';
import { associatedFoodPanelDefaultProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts/portion';
import FoodSearchPrompt from '@intake24/survey/components/prompts/standard/FoodSearchPrompt.vue';

import BaseExpansionPortion from './BaseExpansionPortion';

export default defineComponent({
  name: 'AssociatedFoodPanel',

  components: { FoodSearchPrompt, PortionSizeOptionPrompt },

  mixins: [BaseExpansionPortion],

  props: {
    promptProps: {
      type: Object as PropType<AssociatedFoodsPanelProps>,
      required: true,
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
        name: { en: '' },
        text: { en: '' },
        description: { en: '' },
        conditions: [],
      } as FoodSearchPromptProps,
      assocFoodDescription: '',
      portionOptionProps: {
        name: { en: '' },
        text: { en: '' },
        description: { en: '' },
        conditions: [],
      } as BasePromptProps,
    };
  },

  computed: {
    localeDescription(): string {
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
    emitFoodSelected(value: UserFoodData) {
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
