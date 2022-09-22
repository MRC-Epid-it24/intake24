<template>
  <portion-layout :description="promptProps.description" :text="promptProps.text">
    <template #header>
      {{ $t('portion.option.label', { food: localeDescription }) }}
    </template>
    <v-sheet>
      <v-row class="mt-2 ma-2">
        <v-col
          v-for="(method, index) in availableMethods"
          :key="index"
          class="mx-auto"
          cols="6"
          lg="3"
          md="4"
          @click="selectMethod(index)"
        >
          <v-card :elevation="returnSelectElevation(index)">
            <v-img aspect-ratio="1" class="align-end" contain :src="method.imageUrl">
              <v-chip class="ma-2" :color="returnSelectedStyle(index)">
                {{ $t(`portion.option.description.${method.description}`) }}
              </v-chip>
              <template #placeholder>
                <v-alert outlined text>
                  <v-progress-circular
                    class="mr-2"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                  {{ $t('portion.option.imageInvalid') }}
                </v-alert>
              </template>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
        </v-col>
      </v-row>
      <template #actions>
        <v-form ref="form" @submit.prevent="submit">
          <!-- Should be disabled if nothing selected? -->
          <continue :disabled="!continueEnabled" @click="submit"></continue>
        </v-form>
      </template>
    </v-sheet>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods';
import { basePromptProps } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { localeContent } from '@intake24/survey/components/mixins';

import BasePortion from './BasePortion';

type Response = null | number;

export interface PortionSizeOptionState {
  option: number | null;
}

// For user to select which portion size estimation method they want to use
export default defineComponent({
  name: 'PortionSizeOptionPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    availableMethods: {
      type: Array as PropType<UserPortionSizeMethod[]>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    initialValue: {
      type: Object as PropType<PortionSizeOptionState>,
      default: null,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      currentValue: this.initialValue?.option,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    onChange(index: number) {
      let response: Response = null;
      if (index !== -1) {
        response = this.currentValue === undefined ? null : this.currentValue;
      }
      this.$emit('update', {
        option: response,
      });
    },

    selectMethod(index: number) {
      if (this.currentValue === index) {
        this.currentValue = -1;
        this.onChange(this.currentValue);
      } else {
        this.currentValue = index;
        this.onChange(this.currentValue);
        this.clearErrors();
      }
    },

    clearErrors() {
      this.errors = [];
    },

    isValid() {
      // Check user has selected a method
      if (this.currentValue !== -1) {
        return true;
      }
      return false;
    },

    // Styling for chip to denote selected
    returnSelectedStyle(index: number) {
      if (this.currentValue === index) {
        return 'green';
      }
      return 'false';
    },

    returnSelectElevation(index: number) {
      // Elevation for card based on selected or not
      if (this.currentValue === index) {
        return 12;
      }
      return 0;
    },

    submit() {
      this.$emit('continue');
    },
  },
});
</script>

<style lang="scss" scoped></style>
