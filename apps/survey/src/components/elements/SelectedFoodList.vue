<template>
  <v-card v-if="show" flat>
    <v-card-text class="d-flex flex-column flex-md-row pa-0 ga-2">
      <v-container>
        <v-row
          v-for="(food, foodIndex) in step.foods"
          :key="foodIndex"
          align="baseline"
          class="pa-0"
        >
          <v-alert class="flex-grow-1 pa-0 ms-1" density="compact" icon="$food">
            {{ step.foods[foodIndex].name }}
            <template #prepend>
              <v-icon icon="$food" start />
            </template>
            <template #append>
              <v-btn
                class="btn-truncate"
                color="primary"
                title="Change/Delete"
                variant="flat"
                @click="remove(index, foodIndex)"
              >
                <v-icon icon="$delete" start />
                {{ $t(`prompts.${type}.remove`) }}
              </v-btn>
              <slot />
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
    const type = computed(() => promptType(props.prompt.component));

    const remove = (index: number, foodIndex: number) => {
      emit('remove', { index, foodIndex });
    };

    return { remove, type };
  },
});
</script>

<style scoped></style>
