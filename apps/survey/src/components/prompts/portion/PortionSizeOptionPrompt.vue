<template>
  <portion-layout :text="promptProps.text" :description="promptProps.description">
    <template v-slot:headerText>
      {{ $t('portion.option.label', { food: localeDescription }) }}
    </template>
    <v-sheet>
      <v-row class="mt-2">
        <v-col
          v-for="(method, index) in availableMethods"
          :key="index"
          cols="6"
          md="4"
          lg="3"
          @click="selectMethod(index)"
          class="mx-auto"
        >
          <v-card :elevation="returnSelectElevation(index)">
            <v-img class="align-end" :src="method.imageUrl" contain aspect-ratio="1">
              <v-chip class="ma-2" :color="returnSelectedStyle(index)">
                {{ $t(`portion.option.description.${method.description}`) }}
              </v-chip>
              <template v-slot:placeholder>
                <v-alert outlined text>
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    class="mr-2"
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
          <v-messages v-show="hasErrors" v-model="errors" color="error" class="mt-3"></v-messages>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form ref="form" @submit.prevent="submit">
            <!-- Should be disabled if nothing selected? -->
            <continue @click="submit" :disabled="currentValue === -1"></continue>
          </v-form>
        </v-col>
      </v-row>
    </v-sheet>
  </portion-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { merge } from '@intake24/common/util';
import { BasePromptProps, basePromptProps } from '@intake24/common/prompts';
import { UserPortionSizeMethod } from '@intake24/common/types/http/foods';
import { LocaleTranslation } from '@intake24/common/types';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

// For user to select which portion size estimation method they want to use
export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'PortionSizeOptionPrompt',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => BasePromptProps,
      required: true,
    },
    foodName: {
      type: Object as () => LocaleTranslation,
      required: true,
    },
    availableMethods: {
      type: Array as () => UserPortionSizeMethod[],
      required: true,
    },
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      currentValue: -1,
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
    selectMethod(index: number) {
      if (this.currentValue === index) {
        this.currentValue = -1;
      } else {
        this.currentValue = index;
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
      this.$emit('option-selected', this.currentValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
