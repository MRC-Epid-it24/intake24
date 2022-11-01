<template>
  <div>
    <h3 class="mb-4">{{ drinks ? $t('prompts.editMeal.drinks') : $t('prompts.editMeal.food') }}</h3>
    <v-row>
      <v-col cols="12" sm="8">
        <v-text-field
          ref="foodsDrinksInput"
          v-model="newFoodDescription"
          hide-details
          outlined
          :placeholder="$t('prompts.editMeal.food')"
          @focusout="onEditFocusLost"
          @keypress.enter.stop="addFood"
        >
          <template v-if="isMobile" #append>
            <v-icon class="flip px-2" :disabled="!newFoodDescription.length" @click="addFood">
              fa-arrow-turn-down
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col v-if="!isMobile" cols="4">
        <v-btn
          color="success"
          :disabled="!newFoodDescription.length"
          elevation="2"
          x-large
          @click="addFood"
        >
          <v-icon class="flip" left>fa-arrow-turn-down</v-icon>
          {{ drinks ? $t('prompts.editMeal.addDrink') : $t('prompts.editMeal.addFood') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-list v-if="editableList.length">
      <v-list-item
        v-for="(food, idx) in editableList"
        :key="idx"
        :ripple="false"
        @click="edit(idx)"
      >
        <v-text-field
          v-if="editIndex === idx"
          :value="foodDisplayName(editableList[idx])"
          @focusout="onEditFocusLost"
          @keypress.enter.stop="addFood"
        ></v-text-field>
        <v-list-item-icon v-if="editIndex === idx">
          <v-btn icon @click="deleteFood">
            <v-icon>fa-trash</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-title v-else>{{ foodDisplayName(food) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { FoodState, FreeTextFood } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { useSurvey } from '@intake24/survey/stores';

const component = defineComponent({
  name: 'EditableFoodList',

  props: {
    foodList: {
      type: Array as PropType<FoodState[]>,
      required: true,
    },
    drinks: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      editableList: copy(this.foodList),
      newFoodDescription: '',
      editIndex: null as number | null,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['getNextFoodId']),

    addFood() {
      if (this.editIndex != null) {
        const editEntry = this.editableList[this.editIndex];

        if (editEntry.type === 'free-text' && editEntry.description.trim().length === 0) return;
      }
      if (this.newFoodDescription.length === 0) return;

      const newFood: FreeTextFood = {
        id: this.getNextFoodId(),
        type: 'free-text',
        description: this.newFoodDescription,
        flags: this.drinks ? ['is-drink'] : [],
        customPromptAnswers: {},
        linkedFoods: [],
      };

      this.editableList.push(newFood);

      this.edit(this.editableList.length - 1);
      this.newFoodDescription = '';
      this.$emit('food-added', copy(this.editableList));
    },

    deleteFood() {
      if (this.editIndex != null) {
        this.editableList.splice(this.editIndex, 1);
        this.editIndex = null;
        this.$emit('food-deleted', this.editableList.length, copy(this.editableList));
      }
    },

    onEditFocusLost() {
      if (this.editIndex != null) {
        const editEntry = this.editableList[this.editIndex];
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

    foodDisplayName(food: FoodState): string {
      switch (food.type) {
        case 'free-text':
          return food.description;
        case 'encoded-food':
          return food.data.localName;
        default: {
          console.warn(`Unexpected food type`);
          return '???';
        }
      }
    },
  },
});

export default component;

export type EditableFoodListType = InstanceType<typeof component>;
</script>

<style lang="scss" scoped>
.flip {
  transform: scaleX(-1);
}
</style>
