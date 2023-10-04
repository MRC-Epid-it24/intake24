<template>
  <v-row class="pt-2" justify="center" :no-gutters="isMobile">
    <v-slide-x-transition mode="out-in">
      <v-col v-if="showMealList" cols="3">
        <meal-list v-bind="{ meals }" @action="action"></meal-list>
      </v-col>
    </v-slide-x-transition>
    <v-col :cols="showMealList ? 8 : 9">
      <v-slide-y-transition hide-on-leave mode="out-in">
        <component
          :is="handlerComponent"
          v-if="currentPrompt && !hideCurrentPrompt"
          :key="handlerKey"
          :prompt="currentPrompt.prompt"
          :section="currentPrompt.section"
          @action="action"
        ></component>
      </v-slide-y-transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { MealList } from '../layouts';
import recallMixin from './recall-mixin';

export default defineComponent({
  name: 'RecallDesktop',

  components: { MealList },

  mixins: [recallMixin],
});
</script>

<style lang="scss" scoped></style>
