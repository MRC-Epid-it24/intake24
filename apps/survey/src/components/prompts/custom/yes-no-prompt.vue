<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #actions>
      <yes-no-toggle :value="value" @input="update"></yes-no-toggle>
    </template>
    <template #nav-actions>
      <v-btn value="no" @click.stop="update(false)">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1">$no</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn value="yes" @click.stop="update(true)">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1">$yes</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { YesNoToggle } from '@intake24/survey/components/elements';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'YesNoPrompt',

  components: { YesNoToggle },

  mixins: [createBasePrompt<'yes-no-prompt'>()],

  props: {
    value: {
      type: Boolean,
      default: undefined,
    },
  },

  emits: ['input'],

  computed: {
    isValid(): boolean {
      return this.value !== undefined;
    },
  },

  methods: {
    update(value: boolean) {
      this.$emit('input', value);
      this.action('next');
    },
  },
});
</script>

<style lang="scss" scoped></style>
