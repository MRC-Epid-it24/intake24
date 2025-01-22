<template>
  <v-card class="pb-4" flat tile>
    <v-toolbar color="grey-lighten-4" flat>
      <v-icon end>
        {{ mode === 'drinksOnly' ? '$drink' : '$food' }}
      </v-icon>
      <v-toolbar-title>
        {{ promptI18n.title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" sm="10">
          <v-form @submit.prevent="moveToList">
            <div class="d-flex">
              <v-text-field
                ref="search"
                v-model.trim="newFood.description"
                hide-details
                :name="`${mode}-food`"
                :placeholder="promptI18n.title"
                @keydown.prevent.stop.enter="moveToList"
                @update:model-value="updateFood"
              >
                <template v-if="$vuetify.display.xs" #append>
                  <v-icon
                    class="px-2"
                    :disabled="!newFood.description.length"
                    :title="promptI18n.add"
                    @click="moveToList"
                  >
                    fas fa-turn-down fa-rotate-90
                  </v-icon>
                </template>
              </v-text-field>
              <v-btn
                v-if="$vuetify.display.smAndUp"
                class="ms-2"
                color="primary"
                :disabled="!newFood.description.length"
                height="initial"
                size="x-large"
                :title="promptI18n.add"
                @click="moveToList"
              >
                <v-icon start>
                  fas fa-turn-down fa-rotate-90
                </v-icon>
                {{ promptI18n.add }}
              </v-btn>
            </div>
          </v-form>
          <v-list v-if="foods.length" class="list-border" density="compact">
            <v-list-item
              v-for="(food, idx) in foods"
              :key="idx"
              class="ps-0"
              density="compact"
              :ripple="false"
            >
              <template #prepend>
                <v-icon icon="fas fa-caret-right" />
              </template>
              <v-text-field
                v-if="food.type === 'free-text'"
                v-model.trim="food.description"
                class="v-input-basis-stretch"
                density="compact"
                hide-details
                variant="underlined"
                @focusout.stop="focusOut(idx)"
                @update:model-value="updateFood"
              />
              <v-list-item-title v-else>
                {{ getFoodName(food) }}
              </v-list-item-title>
              <template #append>
                <confirm-dialog
                  :label="$t('recall.menu.food.delete')"
                  @confirm="deleteFood(idx)"
                >
                  <template #activator="{ props: aProps }">
                    <v-btn icon="$delete" :title="$t('recall.menu.food.delete')" v-bind="aProps" />
                  </template>
                  <i18n-t keypath="recall.menu.food.deleteConfirm" tag="span">
                    <template #item>
                      <span class="font-weight-medium">{{ getFoodName(food) }}</span>
                    </template>
                  </i18n-t>
                </confirm-dialog>
              </template>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { VTextField } from 'vuetify/components';
import { useDebounceFn } from '@vueuse/core';
import { computed, nextTick, onMounted, ref } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { FoodState, FreeTextFood, PromptSection } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils, usePromptUtils } from '@intake24/survey/composables';
import { getEntityId } from '@intake24/survey/util';
import { ConfirmDialog } from '@intake24/ui';

defineOptions({ name: 'EditableFoodList' });

const props = defineProps({
  focus: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String as PropType<'foods' | 'foodsOnly' | 'drinksOnly'>,
    default: 'foods',
  },
  prompt: {
    type: Object as PropType<Prompt>,
    required: true,
  },
  section: {
    type: String as PropType<PromptSection>,
    required: true,
  },
  modelValue: {
    type: Array as PropType<FoodState[]>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue', 'delete']);

const { getFoodName } = useFoodUtils();
const { i18n: { t } } = useI18n();
const { type } = usePromptUtils(props, { emit });

const promptI18n = computed(() => ({
  title: t(`prompts.${type.value}.${props.mode}`),
  add: t(`prompts.${type.value}.add`),
}));

const search = ref<InstanceType<typeof VTextField>>();

const foods = ref(copy(props.modelValue));

function createFood(): FreeTextFood {
  return {
    id: getEntityId(),
    type: 'free-text',
    description: '',
    flags: props.mode === 'drinksOnly' ? ['is-drink'] : [],
    customPromptAnswers: {},
    linkedFoods: [],
  };
}

const newFood = ref(createFood());

function updateFoods() {
  emit(
    'update:modelValue',
    newFood.value.description.length ? [...foods.value, newFood.value] : foods.value,
  );
}

const debouncedUpdateFoods = useDebounceFn(
  () => {
    updateFoods();
  },
  500,
  { maxWait: 1000 },
);

function updateFood() {
  debouncedUpdateFoods();
}

function moveToList() {
  if (!newFood.value.description.length)
    return;

  foods.value.push(newFood.value);
  newFood.value = createFood();
  updateFoods();
}

function deleteFood(index: number) {
  const [food] = foods.value.splice(index, 1);
  updateFoods();
  emit('delete', food.id);
}

function focusOut(index: number) {
  const editEntry = foods.value[index];

  if (editEntry.type === 'free-text' && !editEntry.description.trim().length)
    deleteFood(index);
}

onMounted(async () => {
  if (!props.focus || !search.value)
    return;

  await nextTick();
  search.value.focus();
});
</script>

<style lang="scss" scoped>
.v-input-basis-stretch {
  flex: 1 1 100%;
}
</style>
