<template>
  <div>
    <v-row justify="center" no-gutters class="d-print-none">
      <v-col v-for="card in cards" :key="card.id" class="pa-4" cols="auto">
        <screen-card :parameters="card"></screen-card>
      </v-col>
    </v-row>
    <div v-for="card in cards" :key="`print-${card.id}`" class="d-none d-print-block">
      <print-card :parameters="card"></print-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { FeedbackCardParameters } from '@intake24/ui/feedback';
import { PrintCard, ScreenCard } from './cards';

export default defineComponent({
  name: 'FeedbackCardArea',

  components: { PrintCard, ScreenCard },

  props: {
    cards: {
      type: Array as PropType<FeedbackCardParameters[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss"></style>
