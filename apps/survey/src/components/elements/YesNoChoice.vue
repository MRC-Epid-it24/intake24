<template>
  <v-btn-toggle
    class="bg-grey-lighten-4"
    divided
    variant="outlined"
  >
    <v-btn class="px-10 flex-grow-1 flex-md-grow-0" :title="$t('common.action.no')" @click="updateValue(false)">
      <v-icon :color="modelValue === false ? 'primary' : 'secondary '" start>
        $no
      </v-icon>
      {{ $t('common.action.no') }}
    </v-btn>
    <v-btn class="px-10 flex-grow-1 flex-md-grow-0" :title="$t('common.action.yes')" @click="updateValue(true)">
      <v-icon :color="modelValue === true ? 'primary' : 'secondary '" start>
        $yes
      </v-icon>
      {{ $t('common.action.yes') }}
    </v-btn>
  </v-btn-toggle>
</template>

<script lang="ts">
/*
  This is similar to YesNoToggle, but avoids the problem with YesNoPrompt where if the initial value
  of the toggle button is set (to either yes or no), clicking on corresponding the button resets
  the component to undefined and needs a second click to proceed.

  YesNoToggle is designed to work with the explicit continue button, but the YesNoPrompts no longer has
  those.

  This component is visually the same, and can also start in an undefined state, but once an answer has
  been selected, it cannot be reset back to undefined. Clicking on an already selected button will set
  the model to the same value instead, allowing the YesNoPrompt to proceed.
*/

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'YesNoToggle',

  props: {
    mandatory: {
      type: Boolean,
    },
    modelValue: {
      type: Boolean,
    },
  },

  emits: ['update:modelValue'],

  methods: {
    updateValue(value: boolean) {
      this.$emit('update:modelValue', value);
    },
  },
});
</script>

<style></style>
