<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row v-show="visible">
      <v-col>
        <v-btn @click="showComponent(0)">Portion Option</v-btn>
        <v-btn @click="showComponent(1)">As Served</v-btn>
        <v-btn @click="showComponent(3)">Guide Image</v-btn>
        <v-btn @click="showComponent(4)">Drink Scale</v-btn>
        <v-btn @click="showComponent(5)">Standard portion</v-btn>
        <v-btn @click="showComponent(6)">Cereal</v-btn>
        <v-btn @click="showComponent(8)">Pizza</v-btn>
        <v-btn @click="showComponent(9)">Milk in a hot drink</v-btn>
        <v-btn @click="showComponent(10)">Direct weight input</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="visible = !visible">Show/Hide buttons</v-btn>
      </v-col>
    </v-row>
    <!-- <v-row v-show="componentView == 0" justify-md="center" no-gutters>
      <v-col cols="12" md="10">
      </v-col>
    </v-row> -->
    <v-row justify-md="center" no-gutters>
      <v-col>
        <portion-size-option-prompt
          v-show="componentView == 0"
          :prompt-props="testProps"
          :food-name="foodName"
          :available-methods="portionMethods"
        ></portion-size-option-prompt>

        <as-served-prompt
          v-show="componentView == 1"
          :prompt-props="asServedProps"
          :food-name="foodName"
          :as-served-set-id="asServedSetId"
        ></as-served-prompt>

        <guideImagePrompt
          v-if="componentView == 3"
          :prompt-props="asServedProps"
          :food-name="foodName"
          guide-image-id="Gcans"
        ></guideImagePrompt>

        <drink-scale-prompt
          v-show="componentView == 4"
          :prompt-props="asServedProps"
          :food-name="'cream soda'"
        ></drink-scale-prompt>

        <standard-portion-prompt
          v-show="componentView == 5"
          :prompt-props="asServedProps"
          :food-name="foodName"
        ></standard-portion-prompt>

        <cereal-prompt
          v-show="componentView == 6"
          :prompt-props="asServedPropsCereal"
          :food-name="foodName"
          :food-code="cerealFoodCode"
          :image-map-id="bowlGuideImageId"
          locale-t-e-m-p="en_GB"
        ></cereal-prompt>

        <pizza-prompt
          v-show="componentView == 8"
          :prompt-props="asServedProps"
          :food-name="foodName"
        ></pizza-prompt>

        <milk-hot-drink-prompt
          v-show="componentView == 9"
          :prompt-props="asServedProps"
          :food-name="foodName"
        ></milk-hot-drink-prompt>

        <direct-weight-prompt
          v-show="componentView == 10"
          :prompt-props="asServedProps"
          :food-name="foodName"
        ></direct-weight-prompt>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// // import prompts from '@intake24/survey/components/prompts/';
// import { portionSizeOptionPromptDefaultProps } from '@intake24/survey/common/prompts/promptDefaults';
// import { PortionSizeOptionPromptProps } from '@intake24/common/types/promptProps';
import portionPrompts from '@intake24/survey/components/prompts/portion';

export default defineComponent({
  name: 'PortionTest',

  // components: { ...prompts, portionSizeOption },
  // components: {
  //   PortionSizeOptionPrompt,
  //   AsServedPrompt,
  //   AsServedLeftoverPrompt,
  // },
  components: {
    ...portionPrompts,
  },

  data() {
    return {
      visible: true,
      componentView: 0,
      testPromptProps: {
        text: { en: 'text' },
        description: { en: 'description' },
      },
      foodName: { en: 'food name' },
      portionMethods: [
        {
          method: 'as-served',
          description: 'use_an_image',
          imageUrl:
            'https://it24-dev.mrc-epid.cam.ac.uk/images/as_served/lasagne/selection/efa5caca-7af4-49f6-b1cf-f3ba197d9f5f.jpg',
          useForRecipes: false,
          conversionFactor: 1.0,
          parameters: {
            'serving-image-set': 'lasagne',
            'leftovers-image-set': 'lasagne_leftovers',
          },
        },
        {
          method: 'drink-scale',
          description: 'in_a_mug',
          imageUrl: 'https://it24-dev.mrc-epid.cam.ac.uk/images/portion/mugs.jpg',
          useForRecipes: false,
          conversionFactor: 1.0,
          parameters: {
            'drinkware-id': 'mugs',
            'initial-fill-level': 0.85,
            'skip-fill-level': false,
          },
        },
        {
          method: 'drink-scale',
          description: 'in_a_takeaway_cup',
          imageUrl: 'https://it24-dev.mrc-epid.cam.ac.uk/images/portion/hotdrinks.jpg',
          useForRecipes: false,
          conversionFactor: 1.0,
          parameters: {
            'drinkware-id': 'takeaway_cups_hot',
            'initial-fill-level': 0.85,
            'skip-fill-level': true,
          },
        },
      ],
      asServedSetId: 'NDNS_meat_curry',
      selectionImageUrl: {},
      testProps: {
        text: { en: 'Portion Size Options' },
        description: { en: 'chicken balti, curry' },
        localDescription: { en: 'chicken balti, curry' },
        methods: [
          {
            method: 'as-served',
            description: 'use_an_image',
            imageUrl:
              'https://api.intake24.org/images/as_served/NDNS_meat_curry/efb03e62-b7e0-4a04-88ef-aa9606ac04d1.jpg',
            // imageUrl: 'https://bad.src',
            useForRecipes: false,
            conversionFactor: 0.0,
            parameters: {
              'serving-image-set': 'meat_curry',
              'leftovers-image-set': 'meat_curry_leftovers',
            },
          },
        ],
        validation: {
          required: false,
          message: { en: null },
        },
      },
      asServedProps: {
        text: { en: 'Portion Size Options' },
        description: { en: 'chicken balti, curry' },
        localDescription: { en: 'chicken balti, curry' },
        asServedSet: {
          id: 'NDNS_meat_curry',
          description: '',
          selectionImageId: 0,
        },
        validation: {
          required: false,
          message: { en: null },
        },
      },
      asServedPropsCereal: {
        text: { en: 'Portion Size Options' },
        description: { en: 'chocolate hoops cereal' },
        localDescription: { en: 'chocolate hoops cereal' },
        validation: {
          required: false,
          message: { en: null },
        },
      },
      bowlGuideImageId: 'gbowl',
      cerealFoodCode: 'HNUT',
    };
  },

  methods: {
    showComponent(index: number) {
      this.componentView = index;
    },
  },
});
</script>

<style>
.test {
  border: 1px solid black;
}
</style>
