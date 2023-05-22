<template>
  <v-card class="pb-4" flat tile>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title>
        <v-icon left>{{ mode === 'drinksOnly' ? '$drink' : '$food' }}</v-icon>
        {{ $t(`prompts.editMeal.${mode}`) }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" sm="10">
          <v-form @submit.prevent="addFood">
            <div class="d-flex">
              <v-text-field
                ref="search"
                v-model.trim="newFoodDescription"
                hide-details
                :name="`${mode}-food`"
                outlined
                :placeholder="$t(`prompts.editMeal.${mode}`)"
                @keydown.prevent.stop.enter="addFood"
              >
                <template v-if="$vuetify.breakpoint.xs" #append>
                  <v-icon class="flip px-2" :disabled="!newFoodDescription.length" @click="addFood">
                    fa-arrow-turn-down
                  </v-icon>
                </template>
              </v-text-field>
              <v-btn
                v-if="$vuetify.breakpoint.smAndUp"
                class="ml-2"
                color="secondary"
                :disabled="!newFoodDescription.length"
                height="initial"
                x-large
                @click="addFood"
              >
                <v-icon class="flip" left>fa-arrow-turn-down</v-icon>
                {{ $t('prompts.editMeal.add') }}
              </v-btn>
            </div>
          </v-form>
          <v-list v-if="foods.length">
            <v-list-item
              v-for="(food, idx) in foods"
              :key="idx"
              class="list-item-border pl-0"
              :ripple="false"
              @click="editFood(idx)"
            >
              <v-list-item-avatar class="my-auto mr-2">
                <v-icon>fas fa-caret-right</v-icon>
              </v-list-item-avatar>
              <v-text-field
                v-if="food.type === 'free-text' && editIndex === idx"
                class="v-input-basis-stretch"
                :value="food.description"
                @focusout.stop="onEditFocusLost(idx)"
                @input="updateFood(idx, $event)"
                @keypress.enter.stop="addFood"
              ></v-text-field>
              <v-list-item-title v-else>{{ getFoodName(food) }}</v-list-item-title>
              <v-list-item-icon class="my-auto">
                <confirm-dialog
                  :label="$t('prompts.editMeal.delete._', { item: getFoodName(food) }).toString()"
                  @confirm="deleteFood(idx)"
                >
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      :title="$t('prompts.editMeal.delete._', { item: getFoodName(food) })"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>$delete</v-icon>
                    </v-btn>
                  </template>
                  {{ $t(`prompts.editMeal.delete.confirm`, { item: getFoodName(food) }) }}
                </confirm-dialog>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VTextField } from 'vuetify/lib';
import { useDebounceFn } from '@vueuse/core';
import { defineComponent, nextTick, onMounted, ref } from 'vue';

import type { FoodState, FreeTextFood } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useFoodUtils } from '@intake24/survey/composables';
import { getEntityId } from '@intake24/survey/util';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'EditableFoodList',

  components: { ConfirmDialog },

  props: {
    focus: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array as PropType<FoodState[]>,
      required: true,
    },
    mode: {
      type: String as PropType<'foods' | 'foodsOnly' | 'drinksOnly'>,
      default: 'foods',
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const { getFoodName } = useFoodUtils();

    const search = ref<InstanceType<typeof VTextField>>();

    const foods = ref(copy(props.value));
    const newFoodDescription = ref('');
    const editIndex = ref<number | null>(null);

    onMounted(async () => {
      if (!props.focus || !search.value) return;

      await nextTick();
      //@ts-expect-error - vuetify types
      search.value.focus();
    });

    const updateFoods = () => {
      emit('input', foods.value);
    };

    const debouncedUpdateFoods = useDebounceFn(
      () => {
        updateFoods();
      },
      500,
      { maxWait: 1000 }
    );

    const editFood = (index: number) => {
      editIndex.value = index;
    };

    const updateFood = (index: number, description: string) => {
      const food = foods.value[index];
      if (food.type !== 'free-text') return;

      food.description = description;

      if (description) debouncedUpdateFoods();
    };

    const addFood = () => {
      if (editIndex.value !== null) {
        const editEntry = foods.value[editIndex.value];

        if (editEntry.type === 'free-text' && !editEntry.description.trim().length) return;
      }

      if (!newFoodDescription.value.length) return;

      const newFood: FreeTextFood = {
        id: getEntityId(),
        type: 'free-text',
        description: newFoodDescription.value,
        flags: props.mode === 'drinksOnly' ? ['is-drink'] : [],
        customPromptAnswers: {},
        linkedFoods: [],
      };

      foods.value.push(newFood);

      editFood(foods.value.length - 1);
      newFoodDescription.value = '';
      updateFoods();
    };

    const deleteFood = (index: number) => {
      if (editIndex.value === index) editIndex.value = null;

      foods.value.splice(index, 1);
      updateFoods();
    };

    const onEditFocusLost = (index: number) => {
      const editEntry = foods.value[index];

      if (editEntry.type === 'free-text' && !editEntry.description.trim().length) deleteFood(index);
    };

    return {
      editIndex,
      foods,
      newFoodDescription,
      addFood,
      deleteFood,
      editFood,
      updateFood,
      getFoodName,
      onEditFocusLost,
      search,
    };
  },
});
</script>

<style lang="scss" scoped>
.flip {
  transform: scaleX(-1);
}
.v-input-basis-stretch {
  flex: 1 1 100%;
}
</style>
