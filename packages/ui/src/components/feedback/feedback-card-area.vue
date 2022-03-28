<template>
  <div>
    <v-row justify="center" no-gutters class="d-print-none">
      <v-col v-for="card in cards" :key="card.id" class="pa-4" cols="auto">
        <generic-card :parameters="card"></generic-card>
      </v-col>
    </v-row>
    <div v-for="card in cards" :key="`print-${card.id}`" class="d-none d-print-block">
      <generic-print-card :parameters="card"></generic-print-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { FeedbackCardParameters } from '@intake24/ui/feedback';
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

<style lang="scss">
@media print {
  .print-card {
    page-break-after: page;
    break-after: page;
  }
}
</style>
