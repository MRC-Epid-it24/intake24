<template>
  <div>
    <v-row class="d-print-none" justify="center" no-gutters>
      <v-col v-for="card in cards" :key="`screen-${card.id}`" class="pa-4" cols="auto">
        <screen-card :parameters="card"></screen-card>
      </v-col>
    </v-row>
    <div v-for="card in cards" :key="`print-${card.id}`" class="d-none d-print-block">
      <print-card :parameters="card"></print-card>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FeedbackCardParameters } from '@intake24/ui/feedback';

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
