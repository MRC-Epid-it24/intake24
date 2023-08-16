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
            v-model="currentValue"
            autofocus
            class="meal-add-prompt__combobox"
            clearable
            :items="defaultMeals"
            :label="promptI18n.label"
            outlined
            @change="update"
          >
          </component>
        </v-col>
      </v-row>
    </v-card-text>
    <template #actions>
      <v-btn
        class="px-4"
        color="secondary"
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
        color="secondary"
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
      <v-btn :disabled="!hasMeals" :title="promptI18n.no" value="cancel">
        <span class="text-overline font-weight-medium" @click="action('cancel')">
          {{ promptI18n.no }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-btn
        color="secondary"
        :disabled="!isValid"
        :title="promptI18n.yes"
        value="next"
        @click="action('next')"
      >
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
import { computed, defineComponent, ref } from 'vue';
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
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { i18n, translatePath } = useI18n();
    const { params, type } = usePromptUtils(props);

    const currentValue = ref<string | undefined>(undefined);

    const i18nPrefix = computed(
      () => `prompts.${type.value}${props.prompt.custom ? '.custom' : ''}`
    );

    const promptI18n = computed(() => ({
      no: i18n.t(`prompts.${type.value}.no`),
      yes: i18n.t(`prompts.${type.value}.yes`),
      description: translatePath(`${i18nPrefix.value}.description`, params.value, true),
      label: i18n.t(`${i18nPrefix.value}.label`),
    }));

    const isValid = computed(() => !!currentValue.value);

    const update = () => {
      emit('update', { state: currentValue.value });
    };

    return { currentValue, promptI18n, isValid, update };
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
