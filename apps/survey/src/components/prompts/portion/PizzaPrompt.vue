<template>
  <portion-layout v-bind="{ method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${method}.label`) }}
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
              {{ $t(`portion.${method}.thicknessLabel`) }}
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
              {{ $t(`portion.${method}.sizeLabel`) }}
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
                  {{ $t(`portion.${method}.wholePizzaButton`) }}
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
                $t(`portion.${method}.slicesQuantityLabel`)
              }}</template>
              <template v-if="wholeSelected">{{ $t('portion.pizza.wholeQuantityLabel') }}</template>
              <template #actions>
                <valid-invalid-icon :valid="quantityComplete"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <quantity-card fraction whole></quantity-card>
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
    <template #actions>
      <continue :disabled="!isValid" @click="submit"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ImageMapSelectorProps, PizzaPromptProps } from '@intake24/common/prompts';
import type { ImageMapEmit } from '@intake24/common/types/http/foods';

import createBasePortion from './createBasePortion';
import { ImageMapSelector, QuantityCard } from './selectors';

export default defineComponent({
  name: 'PizzaPrompt',

  components: { QuantityCard, ImageMapSelector },

  mixins: [createBasePortion<PizzaPromptProps, any>()],

  data() {
    return {
      method: 'pizza',
      // type, thickness and slice prefix are set as default
      pizzaThicknessMapData: [] as any,
      selectedSliceId: 0,
      calculatedSliceMapId: '', // Needs a default value for rendering (unless put some conditional logic)

      typeComplete: false,
      thicknessComplete: false,
      sizeComplete: false,
      quantityComplete: false,
      wholeSelected: false,
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
    localeDescription(): string {
      return this.getLocaleContent(this.description);
    },

    isValid() {
      return (
        this.typeComplete && this.thicknessComplete && this.sizeComplete && this.quantityComplete
      );
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
    setPanel(value: number) {
      this.panel = value;
    },

    // Select type of pizza
    selectPizza(value: ImageMapEmit) {
      console.log(value);
      this.selectedSliceId = value.selectedIdx;
      this.generateSliceId();
      this.setPanel(1);
      this.typeComplete = true;
    },
    selectThickness() {
      this.setPanel(2);
      this.thicknessComplete = true;
    },
    selectSlice(value: ImageMapEmit) {
      this.setPanel(3);
      this.sizeComplete = true;
      this.wholeSelected = false;
    },
    selectWhole() {
      this.setPanel(3);
      this.sizeComplete = true;
      this.wholeSelected = true;
    },
    selectQuantity() {
      this.setPanel(4);
      this.quantityComplete = true;
    },

    submit() {
      console.log('submitted');
    },
  },
});
</script>

<style lang="scss" scoped></style>
