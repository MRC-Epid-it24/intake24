<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify-md="center" no-gutters>
      <v-col cols="12" md="10">
        <!-- <component
          :is="portionSizeOptionPrompt"
          :props="testProps"
        ></component> -->
        <!-- Above requires a computed variable to return :is part unless loading from list -->

        <portionSizeOptionPrompt :props="testProps"></portionSizeOptionPrompt>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
// // import prompts from '@/components/prompts/';
// import { portionSizeOptionPromptDefaultProps } from '@/common/prompts/promptDefaults';
// import { PortionSizeOptionPromptProps } from '@common/types/promptProps';
import portionSizeOptionPrompt from '@/components/prompts/PortionSizeOptionPrompt.vue';

export default Vue.extend({
  name: 'PortionTest',

  // components: { ...prompts, portionSizeOption },
  components: {
    portionSizeOptionPrompt,
  },

  data() {
    return {
      testProps: {
        text: { en: 'Portion Size Options' },
        description: { en: 'Meat lasagne (includes homemade)' },
        localDescription: { en: 'Meat lasagne (includes homemade)' },
        methods: [
          {
            method: "as-served",
            description: "use_an_image",
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fries_2.jpg/800px-Fries_2.jpg',
            // imageUrl: 'https://bad.src',
            useForRecipes: false,
            conversionFactor: 0.0,
            parameters: {
                "serving-image-set": "lasagne",
                "leftovers-image-set": "lasagne_leftovers"
            },
          },
        ],
        validation: {
          required: false,
          message: { en: null },
        },
      },
    };
  },
});
</script>

<style>
.test {
  border: 1px solid black;
}
</style>
