<template>
  <portion-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.label`) }}
          <template #actions>
            <valid-invalid-icon :valid="!!portionSize.milkVolumePercentage"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group
            v-model="portionSize.milkVolumePercentage"
            :column="prompt.orientation === 'column'"
            :error="hasErrors"
            hide-details="auto"
            :row="prompt.orientation === 'row'"
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
          <v-messages v-show="hasErrors" v-model="errors" class="mt-3" color="error"></v-messages>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { ListOption } from '@intake24/common/prompts';
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

  mixins: [createBasePortion<'milk-in-a-hot-drink-prompt', MilkInAHotDrinkPromptState>()],

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
      return (this.prompt.options[this.$i18n.locale] ?? this.prompt.options.en)
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

    update() {
      const { portionSize, panel } = this;

      const state: MilkInAHotDrinkPromptState = { portionSize, panel };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
