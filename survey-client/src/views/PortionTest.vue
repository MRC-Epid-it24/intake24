<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row>
      <v-col>
        <v-btn @click="showComponent(0)">Portion Option</v-btn>
        <v-btn @click="showComponent(1)">As Served</v-btn>
        <v-btn @click="showComponent(2)">As Served Leftovers</v-btn>
        <v-btn @click="showComponent(3)">Guide Image</v-btn>
        <v-btn @click="showComponent(4)">Drink Scale</v-btn>
        <v-btn @click="showComponent(5)">Standard portion</v-btn>
        <v-btn @click="showComponent(6)">Cereal</v-btn>
        <v-btn @click="showComponent(7)">Milk on cereal</v-btn>
        <v-btn @click="showComponent(8)">Pizza</v-btn>
        <v-btn @click="showComponent(9)">Milk in a hot drink</v-btn>
        <v-btn @click="showComponent(10)">Direct weight input</v-btn>
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
          :props="testProps"
        ></portion-size-option-prompt>

        <as-served-prompt v-show="componentView == 1" :props="asServedProps"></as-served-prompt>

        <as-served-leftover-prompt v-show="componentView == 2" :props="asServedProps">
        </as-served-leftover-prompt>

        <guideImagePrompt v-show="componentView == 3" :props="asServedProps"></guideImagePrompt>

        <drink-scale-prompt v-show="componentView == 4" :props="asServedProps"></drink-scale-prompt>

        <standard-portion-prompt
          v-show="componentView == 5"
          :props="asServedProps"
        ></standard-portion-prompt>

        <cereal-prompt v-show="componentView == 6" :props="asServedProps"></cereal-prompt>

        <milk-cereal-prompt v-show="componentView == 7" :props="asServedProps"></milk-cereal-prompt>

        <pizza-prompt v-show="componentView == 8" :props="asServedProps"></pizza-prompt>

        <milk-hot-drink-prompt
          v-show="componentView == 9"
          :props="asServedProps"
        ></milk-hot-drink-prompt>

        <direct-weight-prompt
          v-show="componentView == 10"
          :props="asServedProps"
        ></direct-weight-prompt>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
// // import prompts from '@/components/prompts/';
// import { portionSizeOptionPromptDefaultProps } from '@/common/prompts/promptDefaults';
// import { PortionSizeOptionPromptProps } from '@common/types/promptProps';
import portionPrompts from '@/components/prompts/portion';

export default Vue.extend({
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
      componentView: 0,
      testPromptProps: {
        text: { en: 'text' },
        description: { en: 'description' },
      },
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
        selectionImageUrl:
          'https://api.intake24.org/images/as_served/NDNS_meat_curry/efb03e62-b7e0-4a04-88ef-aa9606ac04d1.jpg',
        // selectionImageUrl: 'https://bad.src',
        asServedSet: {
          id: 'meat_curry',
          description: '',
          selectionImageId: 0,
        },
        validation: {
          required: false,
          message: { en: null },
        },
      },
      asServedImages: [
        'https://api.intake24.org/images/as_served/NDNS_meat_curry/thumbnails/ce913404-9e64-40cb-9baa-02aa08072dfe.jpg',
        'https://api.intake24.org/images/as_served/NDNS_meat_curry/thumbnails/273f6af1-e2f7-452f-93a0-42f68d44855f.jpg',
        'https://api.intake24.org/images/as_served/NDNS_meat_curry/thumbnails/55734371-174c-479b-a042-115af3032800.jpg',
        'https://api.intake24.org/images/as_served/NDNS_meat_curry/thumbnails/efb03e62-b7e0-4a04-88ef-aa9606ac04d1.jpg',
        'https://api.intake24.org/images/as_served/NDNS_meat_curry/thumbnails/a6cd940e-ed69-4920-9375-280082a7c784.jpg',
        'https://api.intake24.org/images/as_served/NDNS_meat_curry/thumbnails/5dfd29ef-0487-435c-a4ad-f0881b82571a.jpg',
        'https://api.intake24.org/images/as_served/NDNS_meat_curry/thumbnails/b45f6c3f-4849-466f-897e-310c143956ee.jpg',
      ],
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
