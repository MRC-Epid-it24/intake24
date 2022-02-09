<template>
  <v-row justify="center" :no-gutters="isMobile">
    <v-col v-for="(card, idx) in cards" class="mb-4" cols="auto" :key="idx">
      <component :is="`${card.type}-card`" :parameters="card"></component>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { FeedbackCardParameters } from '@intake24/survey/feedback';
import { cards } from './cards';

export default defineComponent({
  name: 'FeedbackCardArea',

  components: { ...cards },

  props: {
    cards: {
      type: Array as PropType<FeedbackCardParameters[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss"></style>
