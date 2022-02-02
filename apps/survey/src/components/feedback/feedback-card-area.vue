<template>
  <v-row justify="center" :no-gutters="isMobile">
    <v-col v-for="(result, idx) in results" class="mb-4" cols="auto" :key="idx">
      <component :is="`${result.card}-card`" :parameters="result"></component>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { FeedbackParameters } from '@intake24/survey/feedback';
import { cards } from './cards';

export default defineComponent({
  name: 'FeedbackCardArea',

  components: { ...cards },

  props: {
    results: {
      type: Array as () => FeedbackParameters[],
      required: true,
    },
  },
});
</script>

<style lang="scss"></style>
