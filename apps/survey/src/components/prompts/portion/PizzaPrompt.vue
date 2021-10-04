<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.pizza.label') }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                Please select the pizza that is closest to the size you had.
                <template v-slot:actions>
                  <valid-invalid-icon :valid="typeComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-img @click="selectPizza()" :src="pizzaImageMapData.baseImageUrl"></v-img>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                How thick was your pizza?
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
                What size slice(s) did you have?
                <template v-slot:actions>
                  <valid-invalid-icon :valid="quantityComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-btn @click="selectWhole()">I had the whole pizza</v-btn>
                <v-img :src="pizzaSliceMapData.baseImageUrl" @click="selectSlice()"></v-img>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                <template v-if="!wholeSelected">How many of these slices did you have?</template>
                <template v-if="wholeSelected">How many pizzas did you have?</template>
                <template v-slot:actions>
                  <valid-invalid-icon :valid="sizeComplete"></valid-invalid-icon>
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
import { PizzaPromptProps, pizzaPromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import ValidInvalidIcon from '@/components/elements/ValidInvalidIcon.vue';
import QuantityCard from '@/components/elements/QuantityCard.vue';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'PizzaPrompt',

  components: {
    ValidInvalidIcon,
    QuantityCard,
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
      errors: [] as string[],
      panelOpen: 0 as number,
      // Testing/prototyping variables
      pizzaImageMapId: 'gpizza' as string, // can also be 'Gpiz'
      pizzaImageMapData: [] as any,
      thicknessImageMapId: 'gpthick' as string,
      pizzaThicknessMapData: [] as any,
      pizzaSliceMapId: 'gpiz8' as string,
      pizzaSliceMapData: [] as any,
      typeComplete: false as boolean,
      thicknessComplete: false as boolean,
      sizeComplete: false as boolean,
      quantityComplete: false as boolean,
      wholeSelected: false as boolean,
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
    this.fetchPizzaImageMapData();
    this.fetchThicknessImageMapData();
    this.fetchSliceImageMapData();
  },

  methods: {
    async fetchPizzaImageMapData() {
      try {
        const { data } = await this.$http.get(`portion-sizes/image-maps/${this.pizzaImageMapId}`);
        this.pizzaImageMapData = { ...data };
      } catch (e) {
        console.log(e);
      }
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
    async fetchSliceImageMapData() {
      try {
        const { data } = await this.$http.get(`portion-sizes/image-maps/${this.pizzaSliceMapId}`);
        this.pizzaSliceMapData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },
    setPanelOpen(value: number) {
      this.panelOpen = value;
    },
    selectPizza() {
      this.setPanelOpen(1);
      this.typeComplete = true;
    },
    selectThickness() {
      this.setPanelOpen(2);
      this.thicknessComplete = true;
    },
    selectSlice() {
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
