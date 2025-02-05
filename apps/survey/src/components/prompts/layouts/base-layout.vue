<template>
  <div>
    <v-card class="mb-4" :tile="$vuetify.display.mobile">
      <breadcrumbs v-bind="{ food, meal, promptName: i18n.name }" />
      <slot name="prompt-text">
        <v-card-text v-if="i18n.text" class="pt-0">
          <v-divider class="mb-2" />
          <h3>{{ i18n.text }}</h3>
        </v-card-text>
      </slot>
    </v-card>
    <slot name="prompt-description">
      <v-card v-if="!isInMultiPrompt && i18n.description" class="mb-4" :tile="$vuetify.display.mobile">
        <div class="pa-4" v-html="i18n.description" />
      </v-card>
    </slot>
    <slot />
    <v-card-actions
      v-if="!$vuetify.display.mobile || prompt.actions?.both"
      id="actions"
      class="navigation pa-5 px-md-0 d-flex flex-column-reverse flex-md-row align-stretch flex-wrap ga-3"
    >
      <template v-if="desktopActions.length">
        <v-btn
          v-for="item in desktopActions"
          :key="item.type"
          class="px-4"
          :color="item.color ?? undefined"
          :disabled="item.type === 'next' && !isValid"
          size="large"
          :title="Object.keys(item.label).length ? translate(item.label) : translate(item.text)"
          :variant="item.variant"
          @click="action(item.type, foodOrMealId, item.params)"
        >
          {{ translate(item.text) }}
        </v-btn>
      </template>
      <template v-else>
        <slot name="actions" />
      </template>
    </v-card-actions>
    <div v-if="$vuetify.display.mobile" id="actions" class="bottom-navigation">
      <div v-if="showSummary" class="bottom-navigation__summary">
        <meal-list-mobile v-if="showSummary" v-bind="{ meals }" @action="action" />
      </div>
      <div v-if="mobileActions.length || hasNavActionsSlot" class="bottom-navigation__actions">
        <template v-if="mobileActions.length">
          <template v-for="(item, idx) in mobileActions" :key="item.type">
            <v-btn
              :color="item.color ?? undefined"
              :disabled="item.type === 'next' && !isValid"
              :title="Object.keys(item.label).length ? translate(item.label) : translate(item.text)"
              :value="item.type"
              :variant="item.variant"
              @click="action(item.type, foodOrMealId, item.params)"
            >
              <span class="text-overline font-weight-medium">
                {{ translate(item.text) }}
              </span>
              <v-icon v-if="item.icon" class="pb-1">
                {{ item.icon }}
              </v-icon>
            </v-btn>
            <v-divider
              v-if="idx + 1 < mobileActions.length"
              :key="`div-${item.type}`"
              vertical
            />
          </template>
        </template>
        <template v-else>
          <slot name="nav-actions" />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useSlots } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { FoodState, MealState, PromptSection } from '@intake24/common/surveys';
import { MealListMobile } from '@intake24/survey/components/layouts/meal-list';

import Breadcrumbs from './breadcrumbs.vue';
import { useLayout } from './use-layout';

defineOptions({ name: 'BaseLayout' });

const props = defineProps(
  {
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
    food: {
      type: Object as PropType<FoodState>,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    isValid: {
      type: Boolean,
      default: false,
    },
  },
);

const emit = defineEmits(['action']);
const slots = useSlots();

const {
  action,
  desktopActions,
  foodOrMealId,
  hasNavActionsSlot,
  i18n,
  isInMultiPrompt,
  meals,
  mobileActions,
  showSummary,
  translate,
} = useLayout(props, { emit, slots });
</script>

<style lang="scss"></style>
