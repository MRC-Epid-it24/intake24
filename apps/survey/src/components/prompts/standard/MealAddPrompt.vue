<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <template #prompt-description>
      <div class="px-4 pt-4" v-html="i18n.description"></div>
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
            :label="i18n.label"
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
        :title="i18n.no"
        @click.stop="action('cancel')"
      >
        <v-icon left>$cancel</v-icon>
        {{ i18n.no }}
      </v-btn>
      <v-btn
        class="px-4"
        color="secondary"
        :disabled="!isValid"
        large
        :title="i18n.yes"
        @click="action('next')"
      >
        <v-icon left>$add</v-icon>
        {{ i18n.yes }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :disabled="!hasMeals" :title="i18n.no" value="cancel">
        <span class="text-overline font-weight-medium" @click="action('cancel')">
          {{ i18n.no }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-btn
        color="secondary"
        :disabled="!isValid"
        :title="i18n.yes"
        value="next"
        @click="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ i18n.yes }}
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
    const { translate } = useI18n();
    const { type } = usePromptUtils(props);

    const currentValue = ref<string | undefined>(undefined);

    const i18nPrefix = computed(
      () => `prompts.${type.value}${props.prompt.custom ? '.custom' : ''}`
    );

    const i18n = computed(() => {
      const {
        prompt: { i18n },
      } = props;

      return {
        no: translate(i18n.no, { path: `prompts.${type.value}.no` }),
        yes: translate(i18n.yes, { path: `prompts.${type.value}.yes` }),
        description: translate(i18n.description, {
          path: `${i18nPrefix.value}.description`,
          sanitize: true,
        }),
        label: translate(i18n.label, {
          path: `${i18nPrefix.value}.label`,
        }),
      };
    });

    const isValid = computed(() => !!currentValue.value);

    const update = () => {
      emit('update', { state: currentValue.value });
    };

    return { currentValue, i18n, isValid, update };
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
