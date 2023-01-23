<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }">
    <template #actions>
      <yes-no-toggle v-model="currentValue" @change="update"></yes-no-toggle>
    </template>
    <template #nav-actions>
      <v-btn value="no">
        <span class="text-overline font-weight-medium" @click.stop="setValue(false)">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1">$no</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn color="success" value="yes" @click.stop="setValue(true)">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1">$yes</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { YesNoToggle } from '@intake24/survey/components/elements';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'YesNoPrompt',

  components: { YesNoToggle },

  mixins: [createBasePrompt<'yes-no-prompt'>()],

  emits: ['action', 'update'],

  data() {
    return {
      currentValue: undefined as boolean | undefined,
    };
  },

  computed: {
    isValid(): boolean {
      return this.currentValue !== undefined;
    },
  },

  methods: {
    setValue(value: boolean) {
      this.currentValue = value;
      this.update();
    },

    update() {
      this.$emit('update', { state: this.currentValue });
      this.$emit('action', 'next');
    },
  },
});
</script>

<style lang="scss" scoped></style>
