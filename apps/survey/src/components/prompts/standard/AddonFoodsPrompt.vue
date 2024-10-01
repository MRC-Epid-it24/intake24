<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <div class="py-4">
      <div v-for="meal in meals" :key="meal.id">
        <div class="subtitle-1 font-weight-medium px-4 py-2">
          {{ translate(meal.name) }}
        </div>
        <v-divider />
        <v-list dense>
          <v-list-item v-for="food in meal.foods" :key="food.id">
            <v-list-item-content>
              <v-list-item-title class="mb-4">
                <!-- @vue-expect-error TODO: improve type (encoded foods filtered in handler) -->
                {{ food.data.localName }}
              </v-list-item-title>
              <div v-for="(addon, idx) in foods[food.id]" :key="idx" class="d-flex flex-column flex-md-row align-stretch align-md-center ga-2">
                <v-btn-toggle
                  color="primary"
                  :value="addon.confirmed"
                  @change="updateConfirmed(food.id, idx, $event)"
                >
                  <v-btn class="px-4" height="40" :value="false">
                    {{ promptI18n.didNotHave }}
                  </v-btn>
                </v-btn-toggle>
                <v-select
                  dense
                  :disabled="addon.confirmed === false"
                  hide-details="auto"
                  item-text="localName"
                  item-value="code"
                  :items="addonFoods"
                  :label="promptI18n.food"
                  outlined
                  return-object
                  :value="addon.data"
                  @input="updateFood(food.id, idx, $event)"
                />
                <!-- @vue-expect-error vuetify2 not typed closure -->
                <v-select
                  v-model="addon.portionSize.unit"
                  dense
                  :disabled="addon.confirmed === false || !addon.data"
                  hide-details="auto"
                  :item-text="(item) => getStandardUnitEstimateIn(item)"
                  item-value="name"
                  :items="getAddonFoodsUnits(food.id, idx)"
                  :label="promptI18n.portion"
                  outlined
                  return-object
                  @change="updateUnit(food.id, idx)"
                />
                <v-select
                  v-model="addon.portionSize.quantity"
                  dense
                  :disabled="addon.confirmed === false || !addon.data"
                  hide-details="auto"
                  :items="[0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                  :label="promptI18n.quantity"
                  outlined
                  @change="updateQuantity(food.id, idx)"
                />
                <v-icon
                  v-if="isAddonFoodValid(addon)"
                  color="green"
                >
                  $check
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </div>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, onMounted, ref } from 'vue';

import type {
  PromptStates,
} from '@intake24/common/prompts';
import type { PortionSizeParameters, StandardUnit } from '@intake24/common/surveys';
import type { MealState } from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';
import { categoriesService, foodsService } from '@intake24/survey/services';

import createBasePrompt from '../createBasePrompt';
import { useStandardUnits } from '../partials';

export default defineComponent({
  name: 'AddonFoodsPrompt',

  mixins: [createBasePrompt<'addon-foods-prompt'>()],

  props: {
    localeId: {
      type: String,
      required: true,
    },
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
    value: {
      type: Object as PropType<PromptStates['addon-foods-prompt']>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { action, translatePrompt } = usePromptUtils(props, ctx);
    const { resolveStandardUnits, getStandardUnitEstimateIn } = useStandardUnits();
    const { translate } = useI18n();

    const promptI18n = computed(() =>
      translatePrompt([
        'food',
        'portion',
        'quantity',
        'didNotHave',
      ]),
    );

    const foods = ref(copy(props.value.foods));
    const addonFoods = ref<UserFoodData[]>([]);
    const addonFoodUnits = computed(() => addonFoods.value.reduce<Record<string, { conversionFactor: number; units: StandardUnit[] }>>((acc, food) => {
      let conversionFactor = 0;
      const units = food.portionSizeMethods.reduce<StandardUnit[]>((su, psm, idx, array) => {
        if (psm.method !== 'standard-portion' || psm.conversionFactor !== array[0].conversionFactor)
          return su;

        conversionFactor = psm.conversionFactor;
        su.push(...((psm.parameters as PortionSizeParameters['standard-portion']).units));
        return su;
      }, []);

      acc[food.code] = { conversionFactor, units };

      return acc;
    }, {}));

    function isAddonFoodValid(food: PromptStates['addon-foods-prompt']['foods'][string][number]) {
      return !!(food.confirmed === false
        || (food.data && food.portionSize.unit && food.portionSize.quantity > 0));
    };

    const isValid = computed(() => Object.values(foods.value).every(foods => foods.every(isAddonFoodValid)));

    function getAddonFoodsUnits(foodId: string, idx: number) {
      const code = foods.value[foodId][idx].data?.code;
      return code ? addonFoodUnits.value[code].units : [];
    }

    async function getAddonFoods() {
      const foodCodes: string[] = [];
      if (props.prompt.lookup.type === 'food') {
        foodCodes.push(props.prompt.lookup.value);
      }
      else {
        const contents = await categoriesService.contents(props.localeId, props.prompt.lookup.value);
        foodCodes.push(...contents.foods.map(({ code }) => code));
      }

      return await Promise.all(
        foodCodes.map(code => foodsService.getData(props.localeId, code)),
      );
    }

    async function update() {
      ctx.emit('input', { foods: foods.value });
    };

    async function updatePortionSize(foodId: string, idx: number) {
      const { portionSize: { unit, quantity, linkedQuantity }, data } = foods.value[foodId][idx];

      const conversionFactor = data?.code ? addonFoodUnits.value[data.code].conversionFactor : 1;
      foods.value[foodId][idx].portionSize.servingWeight = (unit?.weight ?? 0) * quantity * conversionFactor * linkedQuantity;

      update();
    };

    async function updateConfirmed(foodId: string, idx: number, confirmed: boolean) {
      foods.value[foodId][idx].confirmed = typeof confirmed === 'boolean' ? confirmed : null;

      if (confirmed === false) {
        foods.value[foodId][idx].data = null;
        foods.value[foodId][idx].portionSize.unit = null;
        foods.value[foodId][idx].portionSize.quantity = 0;
      }

      updatePortionSize(foodId, idx);
    }

    async function updateFood(foodId: string, idx: number, data: UserFoodData | null) {
      foods.value[foodId][idx].data = data;
      foods.value[foodId][idx].portionSize.unit = null;

      if (!data)
        foods.value[foodId][idx].confirmed = null;

      updatePortionSize(foodId, idx);
    };

    async function updateUnit(foodId: string, idx: number) {
      updatePortionSize(foodId, idx);
    };

    async function updateQuantity(foodId: string, idx: number) {
      updatePortionSize(foodId, idx);
    };

    onMounted(async () => {
      addonFoods.value = await getAddonFoods();

      const names = [
        ...new Set(
          Object.values(addonFoodUnits.value)
            .map(({ units }) => units)
            .flat()
            .filter(({ inlineEstimateIn }) => !inlineEstimateIn)
            .map(({ name }) => name),
        ),
      ];

      await resolveStandardUnits(names);
    });

    return {
      action,
      addonFoods,
      getAddonFoodsUnits,
      getStandardUnitEstimateIn,
      foods,
      isAddonFoodValid,
      isValid,
      promptI18n,
      updateConfirmed,
      updateFood,
      updateUnit,
      updateQuantity,
      translate,
    };
  },
});
</script>

<style lang="scss" scoped></style>
