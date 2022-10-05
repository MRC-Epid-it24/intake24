<template>
  <portion-layout v-bind="{ method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panelOpen" flat>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${method}.label`) }}
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
import { defineComponent } from 'vue';

import type { ListOption, MilkInAHotDrinkPromptProps } from '@intake24/common/prompts';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';

export interface MilkInAHotDrinkState {
  milkPartIndex: number | null;
  milkVolumePercentage: number | null;
}

export default defineComponent({
  name: 'MilkInAHotDrinkPrompt',

  mixins: [createBasePortion<MilkInAHotDrinkPromptProps, MilkInAHotDrinkState>()],

  data() {
    return {
      method: 'milk-in-a-hot-drink',
      panelOpen: 0,
      state: copy(this.initialState),
    };
  },

  computed: {
    localeOptions(): ListOption[] {
      return this.options[this.$i18n.locale] ?? this.options.en;
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
