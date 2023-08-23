<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #actions>
      <next :disabled="!isValid" @click="action('next')">
        {{ $t('recall.actions.submit') }}
      </next>
    </template>
    <template #nav-actions>
      <v-btn color="primary" text @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.addMeal') }}
        </span>
        <v-icon class="pb-1">$add</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <next-mobile :disabled="!isValid" @click="action('next')">
        {{ $t('recall.actions.nav.submit') }}
      </next-mobile>
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
