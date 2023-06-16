<template>
  <v-list v-if="foods.length" class="pa-0">
    <div v-for="food in foods" :key="food.id">
      <v-list-item
        :class="{ selected: food.id === selectedFoodId, 'pl-4': !linked, 'pl-8': linked }"
        link
        @click="foodSelected(food.id)"
      >
        <v-list-item-title class="text-wrap">{{ getFoodName(food) }}</v-list-item-title>
        <v-list-item-action class="d-flex flex-row">
          <v-tooltip v-if="food.type === 'free-text'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" class="mr-1" color="grey" small v-on="on">$question</v-icon>
            </template>
            <span>{{ $t('recall.menu.food.notMatched') }}</span>
          </v-tooltip>
          <v-tooltip v-if="food.type === 'encoded-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" class="mr-1" color="green darken-2" small v-on="on">
                $ok
              </v-icon>
            </template>
            <span>{{ $t('recall.menu.food.encoded') }}</span>
          </v-tooltip>
          <v-tooltip v-if="food.type === 'missing-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" class="mr-1" color="green darken-2" small v-on="on">
                $ok
              </v-icon>
            </template>
            <span>{{ $t('recall.menu.food.missing') }}</span>
          </v-tooltip>
          <v-tooltip v-if="food.type === 'encoded-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                :color="food.portionSize ? 'green darken-2' : undefined"
                small
                v-on="on"
              >
                {{ food.portionSize ? '$ok' : '$question' }}
              </v-icon>
            </template>
            <span>
              {{
                $t(
                  `recall.menu.food.${
                    food.portionSize ? 'portionSizeComplete' : 'portionSizeIncomplete'
                  }`
                )
              }}
            </span>
          </v-tooltip>
          <v-tooltip v-else-if="food.type === 'missing-food'" bottom>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                :color="food.info ? 'green darken-2' : undefined"
                small
                v-on="on"
              >
                {{ food.info ? '$ok' : '$question' }}
              </v-icon>
            </template>
            <span>
              {{
                $t(
                  `recall.menu.food.${food.info ? 'missingInfoComplete' : 'missingInfoIncomplete'}`
                )
              }}
            </span>
          </v-tooltip>
          <v-tooltip v-else bottom>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" color="grey" small v-on="on">$question</v-icon>
            </template>
            <span>{{ $t('recall.menu.food.portionSizeIncomplete') }}</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-action class="my-auto">
          <context-menu
            :entity="food"
            :entity-name="getFoodName(food)"
            v-bind="{ menu: getMenu(food) }"
            @action="action"
          ></context-menu>
        </v-list-item-action>
      </v-list-item>
      <food-item
        :foods="food.linkedFoods"
        linked
        :selected-food-id="selectedFoodId"
        @action="action"
        @food-selected="foodSelected"
      ></food-item>
    </div>
  </v-list>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FoodActionType } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import type { MenuItem } from '@intake24/survey/components/elements';
import { useI18n } from '@intake24/i18n';
import { ContextMenu } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';

export default defineComponent({
  name: 'FoodItem',

  components: { ContextMenu },

  props: {
    // FIXME: Should be an array of objects of type UserFoodData or EncodedUserFoodData ???
    foods: {
      type: Array as PropType<FoodState[]>,
      required: true,
    },
    linked: {
      type: Boolean,
      default: false,
    },
    selectedFoodId: {
      type: String,
      required: false,
    },
  },

  emits: ['food-selected', 'action'],

  setup(props, { emit }) {
    const i18n = useI18n();

    const { getFoodName } = useFoodUtils();

    const getMenu = (food: FoodState): MenuItem[] => [
      {
        name: i18n.t('recall.menu.food.edit').toString(),
        action: 'editFood',
        icon: '$food',
      },
      {
        name: i18n.t('recall.menu.delete._', { item: getFoodName(food) }).toString(),
        action: 'deleteFood',
        dialog: true,
        icon: '$delete',
      },
    ];

    const action = (type: FoodActionType, id?: string) => {
      emit('action', type, id);
    };

    const foodSelected = (foodId: string) => {
      emit('food-selected', foodId);
    };

    return { action, foodSelected, getFoodName, getMenu };
  },
});
</script>

<style scoped></style>
