<template>
  <v-card elevation="0">
    <v-card-title>{{
      drinks ? $t('prompts.editMeal.drinks') : $t('prompts.editMeal.food')
    }}</v-card-title>
    <v-card-text justify="center">
      <v-text-field
        :placeholder="$t('prompts.editMeal.food')"
        @keypress.enter.stop="addFood"
        ref="foodsDrinksInput"
        outlined
        @focusout="onEditFocusLost"
        v-model="newFoodDescription"
      ></v-text-field>
      <v-list v-if="editableList.length > 0">
        <v-list-item
          :ripple="false"
          v-for="(food, idx) in editableList"
          :key="idx"
          @click="edit(idx)"
        >
          <v-text-field
            v-if="editIndex === idx"
            :value="foodDisplayName(editableList[idx])"
            @keypress.enter.stop="addFood"
            @focusout="onEditFocusLost"
          ></v-text-field>
          <v-list-item-icon v-if="editIndex === idx">
            <v-btn icon @click="deleteFood">
              <v-icon>fa-trash</v-icon>
            </v-btn>
          </v-list-item-icon>
          <v-list-item-title v-else>{{ foodDisplayName(food) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions :class="isNotDesktop && 'justify-center'">
      <v-btn
        @click="addFood"
        color="secondary"
        elevation="2"
        x-large
        :disabled="newFoodDescription.length === 0"
      >
        {{ drinks ? $t('prompts.editMeal.addDrink') : $t('prompts.editMeal.addFood') }}
        <v-icon right>fa-edit</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { PropType } from '@vue/composition-api';
import type { FoodState, FreeTextFood } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';

export interface HasEditableFoodList {
  editableList: FoodState[];
}

export default (Vue as VueConstructor<Vue & HasEditableFoodList>).extend({
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
</script>
