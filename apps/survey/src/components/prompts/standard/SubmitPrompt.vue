<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <template #actions>
      <next :disabled="!isValid" @click="action('next')">
        {{ $t('recall.actions.submit') }}
      </next>
    </template>
    <template #nav-actions>
      <v-btn value="addMeal" @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.addMeal') }}
        </span>
        <v-icon class="pb-1">$add</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn value="review" @click.stop="action('review')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.review') }}
        </span>
        <v-icon class="pb-1">$survey</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
        :color="isValid ? 'secondary' : 'primary'"
        :disabled="!isValid"
        value="next"
        @click="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.submit') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SubmitPrompt',

  mixins: [createBasePrompt<'submit-prompt'>()],

  setup() {
    const isValid = computed(() => true);

    return {
      isValid,
    };
  },
});
</script>

<style lang="scss" scoped></style>
