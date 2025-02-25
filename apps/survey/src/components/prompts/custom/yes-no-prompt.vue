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
        <v-icon class="pb-1" icon="$no" />
      </v-btn>
      <v-divider vertical />
      <v-btn color="primary" :title="$t('common.action.yes')" variant="text" @click.stop="state = true">
        <span class="text-overline font-weight-medium">
          {{ $t('common.action.yes') }}
        </span>
        <v-icon class="pb-1" icon="$yes" />
      </v-btn>
    </template>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';
import { BaseLayout, CardLayout, PanelLayout } from '../layouts';
import { createBasePromptProps } from '../prompt-props';

defineOptions({
  name: 'YesNoPrompt',
  components: { BaseLayout, CardLayout, PanelLayout },
});

const props = defineProps({
  ...createBasePromptProps<'yes-no-prompt'>(),
  modelValue: {
    type: Boolean,
    default: undefined,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action, customPromptLayout } = usePromptUtils(props, { emit });

const isValid = computed(() => props.modelValue !== undefined);
const state = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);

    if (typeof value === 'boolean')
      action('next');
  },
});
</script>

<style lang="scss" scoped></style>
