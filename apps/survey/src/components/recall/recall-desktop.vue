<template>
  <v-row class="pt-2" justify="center" :no-gutters="isMobile">
    <v-col v-if="showMealList" cols="auto">
      <meal-list v-bind="{ meals }" @action="action"></meal-list>
    </v-col>
    <v-col :cols="showMealList ? 8 : 9">
      <transition mode="out-in" name="component-fade">
        <component
          :is="handlerComponent"
          v-if="currentPrompt && !hideCurrentPrompt"
          :key="handlerKey"
          :prompt="currentPrompt.prompt"
          @action="action"
        ></component>
      </transition>
    </v-col>
    <info-alert
      :info="undo ? 'Undo deletion of ' + undo.type : ''"
      :status="undo ? true : false"
      @alert-dismissed="clearUndo"
    ></info-alert>
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
