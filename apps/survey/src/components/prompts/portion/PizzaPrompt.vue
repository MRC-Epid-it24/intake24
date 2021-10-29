<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.common.completeBelow') }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.pizza.label') }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="typeComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <image-map-selector
                  :promptProps="typePromptProps"
                  @image-map-selector-submit="selectPizza($event)"
                ></image-map-selector>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.pizza.thicknessLabel') }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="thicknessComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-img :src="pizzaThicknessMapData.baseImageUrl" @click="selectThickness()"></v-img>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.pizza.sizeLabel') }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="sizeComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-btn @click="selectWhole()">{{ $t('portion.pizza.wholePizzaLabel') }}</v-btn>
                <image-map-selector
                  :promptProps="sizePromptProps"
                  @image-map-selector-submit="selectSlice($event)"
                ></image-map-selector>
                <!-- <v-img :src="pizzaSliceMapData.baseImageUrl" @click="selectSlice()"></v-img> -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                <template v-if="!wholeSelected">How many of these slices did you have?</template>
                <template v-if="wholeSelected">How many pizzas did you have?</template>
                <template v-slot:actions>
                  <valid-invalid-icon :valid="quantityComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <quantity-card whole fraction></quantity-card>
                  </v-col>
                </v-row>
                <v-btn @click="selectQuantity()">I had that many</v-btn>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
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
import { PizzaPromptProps, pizzaPromptDefaultProps, ImageMapSelectorProps } from '@common/prompts';
import { ImageMapEmit } from '@common/types/http/foods';
import localeContent from '@/components/mixins/localeContent';
import ValidInvalidIcon from '@/components/elements/ValidInvalidIcon.vue';
import QuantityCard from '@/components/elements/QuantityCard.vue';
// import GuideImagePrompt from '@/components/prompts/portion/GuideImagePrompt.vue';
import ImageMapSelector from '@/components/prompts/portion/selectors/ImageMapSelector.vue';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
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
      type: Object as () => PizzaPromptProps,
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
      console.log(value);
      this.setPanelOpen(3);
      this.sizeComplete = true;
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
