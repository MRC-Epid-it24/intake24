<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <template #actions>
      <yes-no-toggle v-model="state" />
    </template>
    <template #nav-actions>
      <v-btn color="primary" :title="$t('common.action.no')" variant="text" @click.stop="state = false">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.no') }}
        </span>
        <v-icon class="pb-1">
          $no
        </v-icon>
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" :title="$t('common.action.yes')" variant="text" @click.stop="state = true">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1">
          $yes
        </v-icon>
      </v-btn>
    </template>
  </component>
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
    modelValue: {
      type: Boolean,
      default: undefined,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { action, customPromptLayout } = usePromptUtils(props, ctx);

    const isValid = computed(() => props.modelValue !== undefined);
    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);

        if (typeof value === 'boolean')
          action('next');
      },
    });

    return {
      action,
      customPromptLayout,
      isValid,
      state,
    };
  },
});
</script>

<style lang="scss" scoped></style>
