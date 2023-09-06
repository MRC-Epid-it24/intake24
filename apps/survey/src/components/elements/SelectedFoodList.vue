<template>
  <v-card v-if="show" class="pa-0" flat>
    <v-card-text class="d-flex flex-column flex-md-row pa-0 ga-2">
      <v-container>
        <v-row
          v-for="(entry, entryIndex) in entries.selectedFoods"
          :key="entryIndex"
          align="baseline"
          class="pa-0"
        >
          <v-alert class="flex-md-grow-1 mr-1" color="grey lighten-4" dense icon="$food">
            {{ showTheName(entries, entryIndex) }}
            <template #prepend>
              <v-icon left>$food</v-icon>
            </template>
            <template #append>
              <v-btn
                color="primary lighten-1"
                depressed
                :title="'Change/Delete'"
                @click="actionClick(index, entryIndex)"
              >
                <v-icon left>$delete</v-icon>
                {{ $t(`prompts.${type}.remove`).toString() }}
              </v-btn>
              <slot> </slot>
            </template>
          </v-alert>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { Console } from 'console';
import { computed, defineComponent } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import type { FoodHeader } from '@intake24/common/types/http';
import { getFoodDescription, RecipeBuilder } from '@intake24/common/types';
import { UserFoodData } from '@intake24/common/types/http';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';
import { promptType } from '@intake24/ui';

export type SelectedFoodParentType = {
  type: 'selected' | 'existing' | 'missing' | 'recipe' | undefined;
  selectedFood?: FoodHeader;
  existingFoodId?: string;
  [key: string]: any;
};

export default defineComponent({
  name: 'SelectedFoodList',

  props: {
    entries: {
      type: Object as PropType<SelectedFoodParentType>,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  emits: ['button-click', 'action'],

  setup(props) {
    const { translate } = useI18n();
    const type = computed(() => promptType(props.prompt.component));

    return { type, translate };
  },

  methods: {
    showTheName(stepState: SelectedFoodParentType, foodIndex: number): string {
      if (stepState.type === 'selected' && stepState.selectedFoods !== undefined)
        return stepState.selectedFoods[foodIndex].name;
      if (stepState.type === 'existing' && stepState.existingFoodId !== undefined) {
        const existingFood = this.meal?.foods.find(
          (exfood) => exfood.id === stepState.existingFoodId
        );
        return existingFood ? getFoodDescription(existingFood) : '';
      }
      if (stepState.type === 'missing')
        return this.$t(`prompts.${this.type}.missing.placeholder`).toString();
      return 'No food selected';
    },

    actionClick(index: number, foodIndex: number) {
      console.log('Action Click: ', index, foodIndex);
      this.$emit('button-click', { index, foodIndex });
    },
  },
});
</script>

<style scoped></style>
