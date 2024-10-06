<template>
  <v-row justify="center" :no-gutters="$vuetify.display.mobile">
    <v-slide-x-transition mode="out-in">
      <v-col v-if="showMealList" cols="3">
        <meal-list v-bind="{ meals }" @action="action" />
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
        />
      </v-slide-y-transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { MealList } from '../layouts';
import recallMixin from './recall-mixin';

/* defineOptions({
  name: 'RecallDesktop',
  mixins: [recallMixin],
}); */

export default defineComponent({
  name: 'RecallDesktop',

  components: { MealList },

  mixins: [recallMixin],
});
</script>

<style lang="scss" scoped></style>
