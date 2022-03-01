<template>
  <v-row justify="center" no-gutters>
    <v-col v-for="card in cards" :key="card.id" class="pa-4 d-print-none" cols="auto">
      <generic-card :parameters="card"></generic-card>
    </v-col>
    <v-col
      v-for="(card, idx) in cards"
      :key="`print-${card.id}`"
      cols="12"
      class="d-none d-print-block"
    >
      <generic-print-card :parameters="card"></generic-print-card>
      <v-divider
        v-if="idx + 1 < cards.length"
        :key="`print-div-${card.id}`"
        class="mb-4 mx-4"
      ></v-divider>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { FeedbackCardParameters } from '@intake24/survey/feedback';
import { GenericCard, GenericPrintCard } from './cards';

export default defineComponent({
  name: 'FeedbackCardArea',

  components: { GenericCard, GenericPrintCard },

  props: {
    cards: {
      type: Array as PropType<FeedbackCardParameters[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss"></style>
