<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template #headerText>
        {{ $t('portion.common.completeBelow') }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.pizza.label') }}
                <template #actions>
                  <valid-invalid-icon :valid="typeComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <image-map-selector
                  :prompt-props="typePromptProps"
                  @image-map-selector-submit="selectPizza($event)"
                ></image-map-selector>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.pizza.thicknessLabel') }}
                <template #actions>
                  <valid-invalid-icon :valid="thicknessComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <image-map-selector
                  :prompt-props="thickPromptProps"
                  @image-map-selector-submit="selectThickness($event)"
                ></image-map-selector>
                <!-- <v-img :src="pizzaThicknessMapData.baseImageUrl" @click="selectThickness()"></v-img> -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.pizza.sizeLabel') }}
                <template #actions>
                  <valid-invalid-icon :valid="sizeComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <template v-if="!sizePromptProps.imageMapId">
                  {{ $t('portion.common.completePreviousStep') }}
                </template>
                <template v-if="sizePromptProps.imageMapId">
                  <v-btn :color="wholeSelected === true ? 'success' : ''" @click="selectWhole()">
                    {{ $t('portion.pizza.wholePizzaButton') }}
                  </v-btn>
                  <image-map-selector
                    :prompt-props="sizePromptProps"
                    @image-map-selector-submit="selectSlice($event)"
                  ></image-map-selector>
                </template>
                <!-- <v-img :src="pizzaSliceMapData.baseImageUrl" @click="selectSlice()"></v-img> -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                <template v-if="!wholeSelected">{{
                  $t('portion.pizza.slicesQuantityLabel')
                }}</template>
                <template v-if="wholeSelected">{{
                  $t('portion.pizza.wholeQuantityLabel')
                }}</template>
                <template #actions>
                  <valid-invalid-icon :valid="quantityComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <quantity-card whole fraction></quantity-card>
                  </v-col>
                </v-row>
                <v-btn @click="selectQuantity()">
                  {{ $t('portion.common.confirmButtonMany') }}
                </v-btn>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn :color="submitButtonStyle()" @click="submit()">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ImageMapSelectorProps, PizzaPromptProps } from '@intake24/common/prompts';
import type { ImageMapEmit } from '@intake24/common/types/http/foods';
import { pizzaPromptDefaultProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import QuantityCard from '@intake24/survey/components/elements/QuantityCard.vue';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import { localeContent } from '@intake24/survey/components/mixins';
// import GuideImagePrompt from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import ImageMapSelector from '@intake24/survey/components/prompts/portion/selectors/ImageMapSelector.vue';

import BasePortion from './BasePortion';

export default defineComponent({
  name: 'PizzaPrompt',

  components: {
    ValidInvalidIcon,
    QuantityCard,
    ImageMapSelector,
  },

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<PizzaPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(pizzaPromptDefaultProps, this.promptProps),
      // type, thickness and slice prefix are set as default
      errors: [] as string[],
      panelOpen: 0 as number,
      pizzaThicknessMapData: [] as any,
      selectedSliceId: 0 as number,
      calculatedSliceMapId: '' as string, // Needs a default value for rendering (unless put some conditional logic)

      typeComplete: false as boolean,
      thicknessComplete: false as boolean,
      sizeComplete: false as boolean,
      quantityComplete: false as boolean,
      wholeSelected: false as boolean,
      typePromptProps: {
        imageMapId: 'gpizza',
      } as ImageMapSelectorProps,
      thickPromptProps: {
        imageMapId: 'gpthick',
      } as ImageMapSelectorProps,
      sizePromptProps: {
        imageMapId: '',
      } as ImageMapSelectorProps,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  mounted() {
    this.fetchThicknessImageMapData();
  },

  methods: {
    generateSliceId() {
      this.calculatedSliceMapId = `${this.slicePrefix}${(this.selectedSliceId + 1).toString()}`;
      this.sizePromptProps.imageMapId = this.calculatedSliceMapId;
    },
    async fetchThicknessImageMapData() {
      try {
        const { data } = await this.$http.get(
          `portion-sizes/image-maps/${this.thicknessImageMapId}`
        );
        this.pizzaThicknessMapData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },
    // async fetchSliceImageMapData() {
    //   try {
    //     const { data } = await this.$http.get(`portion-sizes/image-maps/${this.calculatedSliceMapId}`);
    //     this.pizzaSliceMapData = { ...data };
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },
    setPanelOpen(value: number) {
      this.panelOpen = value;
    },

    // Select type of pizza
    selectPizza(value: ImageMapEmit) {
      console.log(value);
      this.selectedSliceId = value.selectedIdx;
      this.generateSliceId();
      this.setPanelOpen(1);
      this.typeComplete = true;
    },
    selectThickness() {
      this.setPanelOpen(2);
      this.thicknessComplete = true;
    },
    selectSlice(value: ImageMapEmit) {
      this.setPanelOpen(3);
      this.sizeComplete = true;
      this.wholeSelected = false;
    },
    selectWhole() {
      this.setPanelOpen(3);
      this.sizeComplete = true;
      this.wholeSelected = true;
    },
    selectQuantity() {
      this.setPanelOpen(4);
      this.quantityComplete = true;
    },
    submitButtonStyle() {
      if (
        this.typeComplete &&
        this.thicknessComplete &&
        this.sizeComplete &&
        this.quantityComplete
      ) {
        return 'success';
      }
      return '';
    },
    submit() {
      console.log('submitted');
    },
  },
});
</script>

<style lang="scss" scoped></style>
