<template>
  <portion-layout v-bind="{ method: portionSize.method, description, text, foodName }">
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.label`) }}
          <template #actions>
            <valid-invalid-icon :valid="!!portionSize.milkVolumePercentage"></valid-invalid-icon>
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
                <v-radio v-for="option in localeOptions" :key="option.value" :value="option.value">
                  <template #label>
                    {{ option.label }}
                    <v-spacer></v-spacer>
                    <quantity-badge
                      :amount="Number(option.value) * parentServing"
                      unit="ml"
                      :valid="true"
                    ></quantity-badge>
                  </template>
                </v-radio>
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
    <template #actions>
      <continue :disabled="!isValid" @click="confirm"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption, MilkInAHotDrinkPromptProps } from '@intake24/common/prompts';
import type { EncodedFood, MilkInAHotDrinkState } from '@intake24/common/types';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { QuantityBadge } from './selectors';

export interface MilkInAHotDrinkPromptState {
  portionSize: MilkInAHotDrinkState;
  panel: number;
}

export default defineComponent({
  name: 'MilkInAHotDrinkPrompt',

  components: { QuantityBadge },

  mixins: [createBasePortion<MilkInAHotDrinkPromptProps, MilkInAHotDrinkPromptState>()],

  props: {
    parentFood: {
      type: Object as PropType<EncodedFood>,
      required: true,
    },
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    localeOptions(): ListOption<string | number>[] {
      return (this.options[this.$i18n.locale] ?? this.options.en)
        .map((item) => ({
          ...item,
          value: Number.parseFloat(item.value.toString()),
        }))
        .filter(({ value }) => !Number.isNaN(value));
    },

    parentServing() {
      return this.parentFood.portionSize?.servingWeight ?? 100;
    },

    milkValid() {
      return (
        this.portionSize.milkPartIndex !== null && this.portionSize.milkVolumePercentage !== null
      );
    },

    validConditions(): boolean[] {
      return [this.milkValid];
    },
  },

  watch: {
    'portionSize.milkVolumePercentage'(val) {
      this.portionSize.milkPartIndex =
        this.localeOptions.findIndex((option) => option.value === val) ?? null;

      this.updatePanel();
      this.update();
    },
  },

  methods: {
    setErrors() {
      this.errors = [];
    },

    confirm() {
      if (!this.isValid) {
        this.setErrors();
        return;
      }

      this.$emit('confirm');
    },

    update() {
      const { portionSize, panel } = this;

      const state: MilkInAHotDrinkPromptState = { portionSize, panel };

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped></style>
