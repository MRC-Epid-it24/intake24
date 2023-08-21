<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #actions>
      <yes-no-toggle v-mode="state"></yes-no-toggle>
    </template>
    <template #nav-actions>
      <v-btn @click.stop="state = false">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1">$no</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn @click.stop="state = true">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1">$yes</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { YesNoToggle } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';

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

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);

    const isValid = computed(() => props.value !== undefined);
    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });

    return {
      action,
      isValid,
      state,
    };
  },
});
</script>

<style lang="scss" scoped></style>
