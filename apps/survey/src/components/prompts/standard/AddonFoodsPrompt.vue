<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card flat>
      <v-list v-model:opened="opened" class="list-border" density="compact">
        <v-list-group v-for="meal in meals" :key="meal.id" class="mb-2" :value="meal.id">
          <template #activator="{ props }">
            <v-list-item class="text-primary">
              <v-list-item-title class="font-weight-bold text-wrap" v-bind="props">
                {{ translate(meal.name) }}
              </v-list-item-title>
              <template #append>
                <v-list-item-action>
                  <span v-if="meal.time">
                    {{ getMealTime(meal) }}
                  </span>
                  <v-icon v-else icon="$question" size="x-small" />
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
          <v-list-item v-for="food in meal.foods" :key="food.id" class="pb-2" :style="{ 'padding-inline-start': '16px !important' }">
            <v-list-item-title class="mt-2 mb-1">
              <!-- @vue-expect-error TODO: improve type (encoded foods filtered in handler) -->
              {{ food.data.localName }}
            </v-list-item-title>
            <div v-for="(addon, idx) in foods[food.id]" :key="idx" class="d-flex flex-column flex-md-row align-stretch align-md-center ga-2">
              <v-btn-toggle
                base-color="grey-lighten-4"
                class="align-self-stretch"
                color="primary"
                :model-value="addon.confirmed"
                :style="{ 'height': 'unset', 'min-height': '40px' }"
                @update:model-value="updateConfirmed(food.id, idx, $event)"
              >
                <v-btn class="px-4" :value="false">
                  {{ promptI18n.didNotHave }}
                </v-btn>
              </v-btn-toggle>
              <v-select
                density="compact"
                :disabled="addon.confirmed === false"
                hide-details="auto"
                item-title="localName"
                item-value="code"
                :items="addonFoods"
                :label="promptI18n.food"
                :model-value="addon.data"
                return-object
                variant="outlined"
                @update:model-value="updateFood(food.id, idx, $event)"
              />
              <v-select
                v-model="addon.portionSize.unit"
                density="compact"
                :disabled="addon.confirmed === false || !addon.data"
                hide-details="auto"
                :item-title="(item) => getStandardUnitEstimateIn(item)"
                item-value="name"
                :items="getAddonFoodsUnits(food.id, idx)"
                :label="promptI18n.portion"
                return-object
                variant="outlined"
                @update:model-value="updateUnit(food.id, idx)"
              />
              <v-select
                v-model="addon.portionSize.quantity"
                density="compact"
                :disabled="addon.confirmed === false || !addon.data"
                hide-details="auto"
                :items="[0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                :label="promptI18n.quantity"
                variant="outlined"
                @update:model-value="updateQuantity(food.id, idx)"
              />
              <div class="px-1">
                <v-icon
                  v-if="isAddonFoodValid(addon)"
                  color="green"
                  icon="$check"
                />
              </div>
            </div>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </card-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';
import type { PromptStates } from '@intake24/common/prompts';
import type { MealState, PortionSizeParameters, StandardUnit } from '@intake24/common/surveys';
import type { UserFoodData } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { usePromptUtils } from '@intake24/survey/composables';
import { categoriesService, foodsService } from '@intake24/survey/services';
import { CardLayout } from '../layouts';
import { Next, NextMobile, useStandardUnits } from '../partials';
import { createBasePromptProps } from '../prompt-props';

const props = defineProps({
  ...createBasePromptProps<'addon-foods-prompt'>(),
  localeId: {
    type: String,
    required: true,
  },
  meals: {
    type: Array as PropType<MealState[]>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<PromptStates['addon-foods-prompt']>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { translate } = useI18n();
const { action, getMealTime, translatePrompt } = usePromptUtils(props, { emit });
const { resolveStandardUnits, getStandardUnitEstimateIn } = useStandardUnits();

const promptI18n = computed(() =>
  translatePrompt([
    'food',
    'portion',
    'quantity',
    'didNotHave',
  ]),
);

const opened = ref(props.meals.map(meal => meal.id));
const foods = ref(copy(props.modelValue.foods));
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
  emit('update:modelValue', { foods: foods.value });
};

async function updatePortionSize(foodId: string, idx: number) {
  const { portionSize: { unit, quantity, linkedQuantity }, data } = foods.value[foodId][idx];

  const conversionFactor = data?.code ? addonFoodUnits.value[data.code].conversionFactor : 1;
  foods.value[foodId][idx].portionSize.servingWeight = (unit?.weight ?? 0) * quantity * conversionFactor * linkedQuantity;

  update();
};

async function updateConfirmed(foodId: string, idx: number, confirmed: boolean | null) {
  foods.value[foodId][idx].confirmed = !!confirmed;

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
</script>

<style lang="scss" scoped></style>
