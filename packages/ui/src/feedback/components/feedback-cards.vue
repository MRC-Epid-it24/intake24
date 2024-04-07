<template>
  <v-container class="container-max">
    <v-row class="d-print-none" justify="center">
      <v-col v-for="card in cards" :key="`screen-${card.id}`" cols="12" md="4" sm="6">
        <screen-card :parameters="card" />
      </v-col>
    </v-row>
    <div v-for="card in cards" :key="`print-${card.id}`" class="d-none d-print-block">
      <print-card :parameters="card" />
    </div>
  </v-container>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FeedbackCardParameters } from '../cards-builder';
import { PrintCard, ScreenCard } from './cards';

export default defineComponent({
  name: 'FeedbackCards',

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
