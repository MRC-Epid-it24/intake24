<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <template #prompt-description>
      <div class="px-4 pt-4" v-html="localeDescription"></div>
    </template>
    <v-row>
      <v-col md="6" sm="12">
        <component
          :is="prompt.custom ? 'v-combobox' : 'v-select'"
          v-model="currentValue"
          autofocus
          class="meal-add-prompt__combobox"
          clearable
          :items="meals"
          :label="$t(`${i18nPrefix}.label`)"
          outlined
          @change="update"
        >
        </component>
      </v-col>
    </v-row>
    <template #actions>
      <v-btn
        :block="isMobile"
        class="px-4"
        color="secondary"
        large
        text
        :title="$t(`prompts.${type}.no`)"
        @click.stop="action('cancel')"
      >
        <v-icon left>$cancel</v-icon>
        {{ $t(`prompts.${type}.no`) }}
      </v-btn>
      <v-btn
        :block="isMobile"
        class="px-4"
        color="secondary"
        :disabled="!isValid"
        large
        :title="$t(`prompts.${type}.yes`)"
        @click="action('next')"
      >
        <v-icon left>$add</v-icon>
        {{ $t(`prompts.${type}.yes`) }}
      </v-btn>
    </template>
    <template #nav-actions>
      <v-btn :title="$t(`prompts.${type}.no`)" value="cancel">
        <span class="text-overline font-weight-medium" @click="action('cancel')">
          {{ $t(`prompts.${type}.no`) }}
        </span>
        <v-icon class="pb-1">$cancel</v-icon>
      </v-btn>
      <v-btn
        color="secondary"
        :disabled="!isValid"
        :title="$t(`prompts.${type}.yes`)"
        value="next"
        @click="action('next')"
      >
        <span class="text-overline font-weight-medium">
          {{ $t(`prompts.${type}.yes`) }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { VCombobox, VSelect } from 'vuetify/lib';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'MealAddPrompt',

  components: { VCombobox, VSelect },

  mixins: [createBasePrompt<'meal-add-prompt'>()],

  props: {
    meals: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  emits: ['update'],

  data() {
    return {
      currentValue: undefined as string | undefined,
    };
  },

  computed: {
    i18nPrefix() {
      return `prompts.${this.type}${this.prompt.custom ? '.custom' : ''}`;
    },

    localeDescription(): string | undefined {
      return this.getLocaleContent(this.prompt.i18n.description, {
        path: `${this.i18nPrefix}.description`,
      });
    },

    isValid() {
      return !!this.currentValue;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue });
    },
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
