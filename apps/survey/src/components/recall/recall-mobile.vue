<template>
  <v-row class="pt-0" justify="center" :no-gutters="$vuetify.display.mobile">
    <v-col class="pa-0" cols="12">
      <transition mode="out-in" name="component-fade">
        <component
          :is="handlerComponent"
          v-if="currentPrompt && !hideCurrentPrompt"
          :key="handlerKey"
          :prompt="currentPrompt.prompt"
          :section="currentPrompt.section"
          @action="action"
        />
      </transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import recallMixin from './recall-mixin';

export default defineComponent({
  name: 'RecallMobile',

  mixins: [recallMixin],
});
</script>

<style lang="scss"></style>
