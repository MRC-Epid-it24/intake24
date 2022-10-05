<template>
  <portion-layout v-bind="{ description, text }">
    <template #header>
      {{ $t('portion.milkInAHotDrink.label', { food: localeFoodName }) }}
    </template>
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panelOpen" flat>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t('portion.milkInAHotDrink.optionsLabel') }}
              <template #actions>
                <valid-invalid-icon :valid="!!state.milkVolumePercentage"></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="state.milkVolumePercentage"
                    :column="orientation === 'column'"
                    :error="hasErrors"
                    hide-details="auto"
                    :row="orientation === 'row'"
                    @change="clearErrors"
                  >
                    <v-radio
                      v-for="option in localeOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    ></v-radio>
                  </v-radio-group>
                  <v-messages
                    v-show="hasErrors"
                    v-model="errors"
                    class="mt-3"
                    color="error"
                  ></v-messages>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <template #actions>
      <continue :disabled="!continueEnabled" @click="submit"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption, MilkInAHotDrinkPromptProps } from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';
import { milkInAHotDrinkPromptDefaultProps } from '@intake24/common/prompts';
import { copy, merge } from '@intake24/common/util';
import { ValidInvalidIcon } from '@intake24/survey/components/elements';

import BasePortion from './BasePortion';

export interface MilkInAHotDrinkState {
  milkPartIndex: number | null;
  milkVolumePercentage: number | null;
}

export default defineComponent({
  name: 'MilkInAHotDrinkPrompt',

  components: { ValidInvalidIcon },

  mixins: [BasePortion],

  props: {
    initialState: {
      type: Object as PropType<MilkInAHotDrinkState>,
      required: true,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<MilkInAHotDrinkPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(milkInAHotDrinkPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      panelOpen: 0,
      state: copy(this.initialState),
    };
  },

  computed: {
    localeFoodName(): string {
      return this.getLocaleContent(this.foodName);
    },

    localeOptions(): ListOption[] {
      return this.options[this.$i18n.locale] ?? this.options.en;
    },

    hasErrors(): boolean {
      return !!this.errors.length;
    },

    isValid() {
      return this.state.milkPartIndex !== null && this.state.milkVolumePercentage !== null;
    },
  },

  watch: {
    'state.milkVolumePercentage'(val) {
      this.state.milkPartIndex =
        this.localeOptions.findIndex((option) => option.value === val) ?? null;

      this.panelOpen = this.state.milkPartIndex === null ? 0 : -1;
      this.update();
    },
  },

  methods: {
    clearErrors() {
      this.errors = [];
    },

    setErrors() {
      this.errors = [];
    },

    submit() {
      if (!this.isValid) {
        this.setErrors();
        return;
      }

      this.$emit('continue');
    },

    update() {
      const { milkPartIndex, milkVolumePercentage } = this.state;
      this.$emit('update', { milkPartIndex, milkVolumePercentage });
    },
  },
});
</script>

<style lang="scss" scoped></style>
