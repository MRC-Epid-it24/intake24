<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #prompt-description>
      <div class="px-4 pt-4" v-html="promptI18n.description"></div>
    </template>
    <v-card-text class="pt-2">
      <v-row>
        <v-col cols="12" md="8">
          <component
            :is="prompt.custom ? 'v-combobox' : 'v-select'"
            v-model="state"
            autofocus
            class="meal-add-prompt__combobox"
            clearable
            :items="defaultMeals"
            :label="promptI18n.label"
            outlined
            :search-input.sync="state"
          >
          </component>
        </v-col>
      </v-row>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="primary"
        :disabled="!hasMeals"
        large
        text
        :title="promptI18n.no"
        @click.stop="action('cancel')"
      >
        <v-icon left>$cancel</v-icon>
        {{ promptI18n.no }}
      </v-btn>
      <v-btn
        class="px-4"
        color="primary"
        :disabled="!isValid"
        large
        :title="promptI18n.yes"
        @click="action('next')"
      >
        <v-icon left>$add</v-icon>
        {{ promptI18n.yes }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn color="primary" :disabled="!hasMeals" text :title="promptI18n.no">
        <span class="text-overline font-weight-medium" @click="action('cancel')">
          {{ promptI18n.no }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-btn color="primary" :disabled="!isValid" :title="promptI18n.yes" @click="action('next')">
        <span class="text-overline font-weight-medium">
          {{ promptI18n.yes }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { VCombobox, VSelect } from 'vuetify/lib';

import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  components: { VCombobox, VSelect },

  mixins: [createBasePrompt<'meal-add-prompt'>()],

  props: {
    defaultMeals: {
      type: Array as PropType<string[]>,
      required: true,
    },
    hasMeals: {
      type: Boolean,
      required: true,
    },
    value: {
      type: String,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { i18n, translatePath } = useI18n();
    const { action, params, type } = usePromptUtils(props, ctx);

    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });
    const isValid = computed(() => !!state.value);
    const i18nPrefix = computed(
      () => `prompts.${type.value}${props.prompt.custom ? '.custom' : ''}`
    );
    const promptI18n = computed(() => ({
      no: i18n.t(`prompts.${type.value}.no`),
      yes: i18n.t(`prompts.${type.value}.yes`),
      description: translatePath(`${i18nPrefix.value}.description`, params.value, true),
      label: i18n.t(`${i18nPrefix.value}.label`),
    }));

    return { action, isValid, promptI18n, state };
  },
});
</script>

<style lang="scss">
.meal-add-prompt__combobox {
  .v-input__append-inner .v-input__icon.v-input__icon--append .v-icon {
    font-size: 30px;
  }
}
</style>
