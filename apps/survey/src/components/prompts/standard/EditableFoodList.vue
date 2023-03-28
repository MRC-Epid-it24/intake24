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
          <div class="d-flex">
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
          <v-list v-if="foods.length">
            <v-list-item
              v-for="(food, idx) in foods"
              :key="idx"
              class="list-item-border pl-0"
              :ripple="false"
              @click="edit(idx)"
            >
              <v-list-item-avatar class="my-auto mr-2">
                <v-icon>fas fa-caret-right</v-icon>
              </v-list-item-avatar>
              <v-text-field
                v-if="editIndex === idx"
                :value="getFoodName(foods[idx])"
                @focusout="onEditFocusLost"
                @keypress.enter.stop="addFood"
              ></v-text-field>
              <v-list-item-title v-else>{{ getFoodName(food) }}</v-list-item-title>
              <v-list-item-icon class="my-auto">
                <v-btn
                  icon
                  :title="$t('prompts.editMeal.delete._', { item: getFoodName(food) })"
                  @click="deleteFood(idx)"
                >
                  <v-icon>$delete</v-icon>
                </v-btn>
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
      if (this.editIndex !== null) {
        const editEntry = this.foods[this.editIndex];

        if (editEntry.type === 'free-text' && editEntry.description.trim().length === 0) return;
      }

      if (!this.newFoodDescription.length) return;

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

    deleteFood(index: number) {
      if (this.editIndex === index) this.editIndex = null;

      this.foods.splice(index, 1);
      this.$emit('input', this.foods);
    },

    onEditFocusLost() {
      if (this.editIndex === null) return;

      const editEntry = this.foods[this.editIndex];

      if (editEntry.type === 'free-text' && !editEntry.description.trim().length)
        this.deleteFood(this.editIndex);
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
