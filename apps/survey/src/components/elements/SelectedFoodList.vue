<template>
  <v-card v-if="show" class="pa-0" flat>
    <v-card-text class="d-flex flex-column flex-md-row pa-0 ga-2">
      <v-container>
        <v-row
          v-for="(food, foodIndex) in step.foods"
          :key="foodIndex"
          align="baseline"
          class="pa-0"
        >
          <v-alert class="flex-md-grow-1 mr-1" color="grey lighten-4" dense icon="$food">
            {{ step.foods[foodIndex].name }}
            <template #prepend>
              <v-icon left>$food</v-icon>
            </template>
            <template #append>
              <v-btn
                class="btn-truncate"
                color="primary lighten-1"
                depressed
                :title="'Change/Delete'"
                @click="remove(index, foodIndex)"
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
import { computed, defineComponent } from 'vue';

import type { Prompt, RecipeBuilderStepState } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { promptType } from '@intake24/ui';

export default defineComponent({
  name: 'SelectedFoodList',

  props: {
    step: {
      type: Object as PropType<RecipeBuilderStepState>,
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

  emits: ['action', 'remove'],

  setup(props, { emit }) {
    const { translate } = useI18n();
    const type = computed(() => promptType(props.prompt.component));

    const remove = (index: number, foodIndex: number) => {
      emit('remove', { index, foodIndex });
    };

    return { remove, type, translate };
  },
});
</script>

<style scoped></style>
