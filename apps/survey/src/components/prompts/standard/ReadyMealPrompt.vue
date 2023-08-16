<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-card v-for="(food, idx) in foods" :key="food.id" class="mb-3" outlined>
        <v-card-text
          class="d-flex flex-column flex-sm-row justify-space-between ready-meal-prompt__item"
        >
          <div class="d-flex align-center">
            <v-btn class="primary font-weight-medium mr-2" dark icon readonly size="x-small">
              {{ idx + 1 }}
            </v-btn>
            <span class="text-subtitle-1 font-weight-medium">{{ food.name }}</span>
          </div>
          <yes-no-toggle v-model="food.value" mandatory @input="update"></yes-no-toggle>
        </v-card-text>
      </v-card>
    </v-card-text>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { MealState } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';

import createBasePrompt from '../createBasePrompt';

export interface ReadyMealPromptState {
  foods: { id: string; name: string; value: boolean | undefined }[];
}

export default defineComponent({
  name: 'ReadyMealPrompt',

  components: { YesNoToggle },

  mixins: [createBasePrompt<'ready-meal-prompt'>()],

  props: {
    initialState: {
      type: Object as PropType<ReadyMealPromptState>,
      required: true,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const foods = ref(copy(props.initialState.foods));

    const isValid = computed(() => foods.value.every((food) => food.value !== undefined));

    const update = () => {
      emit('update', { state: { foods: foods.value } });
    };

    return {
      foods,
      isValid,
      update,
    };
  },
});
</script>

<style lang="scss" scoped>
.ready-meal-prompt__item {
  row-gap: 0.5rem;
}
</style>
