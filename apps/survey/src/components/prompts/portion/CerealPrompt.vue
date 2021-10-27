<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.common.completeBelow') }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpenId">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.cereal.label') }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="bowlComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- <v-img :src="bowlImageMapData.baseImageUrl" @click="selectBowlType()"></v-img>
                Image_maps gbowl -->
                <image-map-selector
                  :promptProps="{ imageMapId }"
                  @image-map-selector-submit="selectBowlType($event)"
                ></image-map-selector>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.asServed.portionLabel', { food: localeDescription }) }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="asServedComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <as-served-selector
                  :asServedSetId="this.cerealType"
                  @as-served-selector-submit="setAsServedStatus($event)"
                ></as-served-selector>
                <!-- cereal_hoopA -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.asServed.leftoverQuestion', { food: localeDescription }) }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="leftoverComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <!-- <p>
                      {{ $t('portion.asServed.leftoverQuestion', { food: localeDescription }) }}
                    </p> -->
                    <v-btn @click="leftoverAnswer(true)">
                      {{ $t('common.confirm.yes') }}
                    </v-btn>
                    <v-btn @click="leftoverAnswer(false)">
                      {{ $t('common.confirm.no') }}
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row v-show="displayLeftovers">
                  <v-col>
                    <as-served-selector
                      :asServedSetId="this.cerealType"
                      @as-served-selector-submit="setLeftoverStatus($event)"
                    ></as-served-selector>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- Assoc prompt 1 -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ assocPromptText0 }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="assoc1Complete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-btn @click="setAssocQuestionDisplay(0, true)">
                  {{ $t('common.confirm.yes') }}
                </v-btn>
                <v-btn @click="setAssocQuestionDisplay(0, false)">
                  {{ $t('common.confirm.no') }}
                </v-btn>
                <associated-food-panel
                  :promptProps="milkPromptProps"
                  v-show="displayAssocPrompts['0']"
                ></associated-food-panel>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- Assoc prompt 2 -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ assocPromptText1 }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="assoc2Complete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-btn @click="setAssocQuestionDisplay(1, true)">
                  {{ $t('common.confirm.yes') }}
                </v-btn>
                <v-btn @click="setAssocQuestionDisplay(1, false)">
                  {{ $t('common.confirm.no') }}
                </v-btn>
                <associated-food-panel
                  :promptProps="milkPromptProps"
                  v-show="displayAssocPrompts['1']"
                ></associated-food-panel>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-alert color="error" v-if="hasErrors">
            <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
          </v-alert>
          <v-btn @click="submit()" :color="submitButtonStyle()">
            {{ $t('common.continue') }}
          </v-btn>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import {
  CerealPromptProps,
  cerealPromptDefaultProps,
  AssociatedFoodsPanelProps,
  ImageMapSelectorEmit,
} from '@common/prompts';
import { LocaleTranslation } from '@common/types';
import { UserFoodData } from '@common/types/http';
import AsServedSelector from '@/components/prompts/portion/selectors/AsServedSelector.vue';
import ImageMapSelector from '@/components/prompts/portion/selectors/ImageMapSelector.vue';
import AssociatedFoodPanel from '@/components/prompts/portion/AssociatedFoodPanel.vue';
import BaseExpansionPortion, { ExpansionPortion } from './BaseExpansionPortion';

interface displayObject {
  '0': boolean;
  '1': boolean;
}
// declare function greet(setting: GreetingSettings): void;

export default (Vue as VueConstructor<Vue & ExpansionPortion>).extend({
  name: 'CerealPrompt',

  components: {
    AsServedSelector,
    AssociatedFoodPanel,
    ImageMapSelector,
  },

  mixins: [BaseExpansionPortion],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => CerealPromptProps,
      required: true,
    },
    foodName: {
      type: Object as () => LocaleTranslation,
      required: true,
    },
    foodCode: {
      type: String,
      required: true,
    },
    imageMapId: {
      type: String,
      required: true,
    },
    localeTEMP: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      ...merge(cerealPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      foodData: {} as UserFoodData,
      bowlTypeSelected: null as number | null,
      // asServedSetId: cereal_rkrisA
      // Foodcode: HNUT
      // Testing/prototyping variables
      // Couldn't find a mapping between imageMap objs and bowl A,B,C,D
      // bowlTypeLookup: ['A', 'B', 'C', 'D'] as string[],
      cerealType: 'cereal_hoopA' as string,
      bowlComplete: false as boolean,
      asServedComplete: false as boolean,
      leftoverComplete: false as boolean,
      assoc1Complete: false as boolean,
      assoc2Complete: false as boolean,
      displayLeftovers: false as boolean,
      displayAssocPrompts: { '0': false, '1': false } as displayObject,

      // Testing associated prompt
      milkPromptProps: {
        text: { en: 'milk' },
        description: { en: 'Did you have milk?' },
        conditions: [],
        validation: {
          required: false,
          message: { en: 'error' },
        },
        expansionPanelTotal: 3,
      } as AssociatedFoodsPanelProps,
      sugarPromptProps: {
        text: { en: 'milk' },
        description: { en: 'Did you have milk?' },
        conditions: [],
        validation: {
          required: false,
          message: { en: 'error' },
        },
        expansionPanelTotal: 3,
      } as AssociatedFoodsPanelProps,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    assocPromptText0(): string | null {
      if (this.dataLoaded) {
        return this.foodData.associatedFoodPrompts[0].promptText;
      }
      return null;
    },
    assocPromptText1(): string | null {
      if (this.dataLoaded) {
        return this.foodData.associatedFoodPrompts[1].promptText;
      }
      return null;
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
    dataLoaded(): boolean {
      return !!Object.keys(this.foodData).length;
    },
    isValid(): boolean {
      if (
        this.bowlComplete &&
        this.asServedComplete &&
        this.leftoverComplete &&
        this.assoc1Complete &&
        this.assoc2Complete
      ) {
        this.clearErrors();
        return true;
      }
      return false;
    },
  },

  mounted() {
    this.fetchFoodData(); // Will also fetch associated prompts
  },

  methods: {
    async fetchFoodData() {
      try {
        const { data } = await this.$http.get(`foods/${this.localeTEMP}/${this.foodCode}`);
        this.foodData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },

    setAssocQuestionDisplay(questionId: number, newValue: boolean) {
      // Not the most elegant solution
      if (this.dataLoaded) {
        if (questionId < this.foodData.associatedFoodPrompts.length) {
          if (questionId === 0) {
            this.displayAssocPrompts[`0`] = newValue;
            if (newValue === false) {
              this.setPanelOpen(4);
              this.assoc1Complete = true;
            } else {
              // Reset if previously set
              this.assoc1Complete = false;
            }
          } else if (questionId === 1) {
            this.displayAssocPrompts[`1`] = newValue;
            if (newValue === false) {
              this.setPanelOpen(-1);
              this.assoc2Complete = true;
            } else {
              this.assoc2Complete = false;
            }
          }
        }
      }
    },

    leftoverAnswer(value: boolean) {
      if (value) {
        this.displayLeftovers = true;
      } else {
        this.leftoverComplete = true;
        this.setPanelOpen(3);
      }
    },

    selectBowlType(status: ImageMapSelectorEmit) {
      this.bowlTypeSelected = status.selectedIdx;
      this.bowlComplete = true;
      this.setPanelOpen(1);
      // Get as served now bowl is confirmed
    },

    // TODO: Implement emission type
    setAsServedStatus(status: Record<string, unknown>) {
      this.asServedComplete = true;
      this.setPanelOpen(2);
    },

    // TODO: Implement emission type
    setLeftoverStatus(status: Record<string, unknown>) {
      this.leftoverComplete = true;
      this.setPanelOpen(-1);
    },

    clearErrors() {
      this.errors = [];
    },

    submitButtonStyle() {
      if (this.isValid) {
        return 'success';
      }
      return '';
    },

    submit() {
      if (this.isValid) {
        // TODO Update state
        console.log('submitted');
      } else {
        this.errors = [this.$t('portion.milkCereal.validation.required').toString()];
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.guides-drawer {
  position: relative;

  svg {
    position: absolute;
    top: 0;
    left: 0;

    .guides-drawer-polygon {
      cursor: pointer;
      fill: transparent;

      &.active,
      &:hover {
        fill: #0d47a1;
        fill-opacity: 0.4;
        stroke-width: 8;
        stroke: #0d47a1;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-opacity: 0.5;
      }
    }
  }
}
</style>
