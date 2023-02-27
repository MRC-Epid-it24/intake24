<template>
  <div>
    <h3 class="mb-4">{{ $t(`prompts.editMeal.${mode}`) }}</h3>
    <v-row>
      <v-col cols="12" sm="9">
        <v-text-field
          ref="foodsDrinksInput"
          v-model="newFoodDescription"
          hide-details
          outlined
          :placeholder="$t(`prompts.editMeal.${mode}`)"
          @focusout="onEditFocusLost"
          @keypress.enter.stop="addFood"
        >
          <template v-if="$vuetify.breakpoint.xs" #append>
            <v-icon class="flip px-2" :disabled="!newFoodDescription.length" @click="addFood">
              fa-arrow-turn-down
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.smAndUp" cols="3">
        <v-btn
          block
          color="secondary"
          :disabled="!newFoodDescription.length"
          elevation="2"
          x-large
          @click="addFood"
        >
          <v-icon class="flip" left>fa-arrow-turn-down</v-icon>
          {{ $t(`prompts.editMeal.add`) }}
        </v-btn>
      </v-col>
    </v-row>
    <v-list v-if="foods.length">
      <v-list-item v-for="(food, idx) in foods" :key="idx" :ripple="false" @click="edit(idx)">
        <v-text-field
          v-if="editIndex === idx"
          :value="getFoodName(foods[idx])"
          @focusout="onEditFocusLost"
          @keypress.enter.stop="addFood"
        ></v-text-field>
        <v-list-item-icon v-if="editIndex === idx">
          <v-btn icon @click="deleteFood">
            <v-icon>fa-trash</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-title v-else>{{ getFoodName(food) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodState, FreeTextFood } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useFoodUtils } from '@intake24/survey/composables';
import { getEntityId } from '@intake24/survey/util';

export default defineComponent({
  name: 'EditableFoodList',

  props: {
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

  setup() {
    const { getFoodName } = useFoodUtils();

    return { getFoodName };
  },

  data() {
    return {
      foods: copy(this.value),
      newFoodDescription: '',
      editIndex: null as number | null,
    };
  },

  methods: {
    addFood() {
      if (this.editIndex != null) {
        const editEntry = this.foods[this.editIndex];

        if (editEntry.type === 'free-text' && editEntry.description.trim().length === 0) return;
      }
      if (this.newFoodDescription.length === 0) return;

      const newFood: FreeTextFood = {
        id: getEntityId(),
        type: 'free-text',
        description: this.newFoodDescription,
        flags: this.mode === 'drinksOnly' ? ['is-drink'] : [],
        customPromptAnswers: {},
        linkedFoods: [],
      };

      this.foods.push(newFood);

      this.edit(this.foods.length - 1);
      this.newFoodDescription = '';
      this.$emit('input', this.foods);
    },

    deleteFood() {
      if (this.editIndex != null) {
        this.foods.splice(this.editIndex, 1);
        this.editIndex = null;
        this.$emit('input', this.foods);
      }
    },

    onEditFocusLost() {
      if (this.editIndex != null) {
        const editEntry = this.foods[this.editIndex];
        if (editEntry.type === 'free-text' && editEntry.description.trim().length === 0)
          this.deleteFood();
      }
    },

    edit(index: number) {
      this.editIndex = index;

      this.$nextTick(() => {
        // FIXME: must be a better way to avoid type errors
        const textField = this.$refs.textField as HTMLInputElement[];
        if (textField === undefined) return;
        textField[0].focus();
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.flip {
  transform: scaleX(-1);
}
</style>
