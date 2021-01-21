<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <v-row justify-md="center" no-gutters>
      <v-col cols="12" md="10">
        <!-- <component
          :is="portionSizeOptionPrompt"
          :props="testProps"
        ></component> -->
        <portionSizeOptionPrompt
          :text="testProps.text"
          :description="testProps.description"
          :methods="testProps.methods"
          :validation="testProps.validation"
          class="test"
        ></portionSizeOptionPrompt>
        <div>
          Some other content here
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
// // import prompts from '@/components/prompts/';
// import { portionSizeOptionPromptProps } from '@/common/prompts/promptDefaults';
import { PortionSizeOptionPromptProps } from '@common/types/promptProps';
import portionSizeOptionPrompt from '@/components/prompts/PortionSizeOptionPrompt.vue';

export default Vue.extend({
  name: 'PortionTest',

  // components: { ...prompts, portionSizeOption },
  components: { 
    portionSizeOptionPrompt 
  },

  data() {
    return {
      testProps: {
        text: { en: "test text" },
        description: { en: "hello world" },
        methods: 'testMethod',
        validation: {
          required: false,
          message: { en: "Validation fail" },
        },
      }

    };
  },
});
</script>

<style>

.test {
  border: 1px solid black;
}
</style>