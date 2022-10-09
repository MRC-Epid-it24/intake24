<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-row>
      <v-col>
        <v-expansion-panels v-model="panel" flat>
          <v-expansion-panel>
            <v-expansion-panel-header disable-icon-rotate>
              {{ $t(`portion.${portionSize.method}.label`) }}
              <template #actions>
                <valid-invalid-icon
                  :valid="!!portionSize.milkVolumePercentage"
                ></valid-invalid-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="portionSize.milkVolumePercentage"
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
import type { MilkInAHotDrinkState } from '@intake24/common/types';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';

export interface MilkInAHotDrinkPromptState {
  portionSize: MilkInAHotDrinkState;
}

export default defineComponent({
  name: 'MilkInAHotDrinkPrompt',

  mixins: [createBasePortion<MilkInAHotDrinkPromptProps, MilkInAHotDrinkPromptState>()],

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    localeOptions(): ListOption[] {
      return this.options[this.$i18n.locale] ?? this.options.en;
    },

    isValid() {
      return (
        this.portionSize.milkPartIndex !== null && this.portionSize.milkVolumePercentage !== null
      );
    },
  },

  watch: {
    'portionSize.milkVolumePercentage'(val) {
      this.portionSize.milkPartIndex =
        this.localeOptions.findIndex((option) => option.value === val) ?? null;

      this.setPanel(this.portionSize.milkPartIndex === null ? 0 : -1);
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
      const { portionSize } = this;

      this.$emit('update', { portionSize });
    },
  },
});
</script>

<style lang="scss" scoped></style>
