<template>
  <component
    :is="customPromptLayout"
    v-bind="{ food, meal, prompt, section, isValid }"
    @action="action"
  >
    <template #actions>
      <template v-if="isFood">
        <confirm-dialog
          :label="$t('recall.menu.food.delete')"
          @confirm="action('deleteFood', food?.id)"
        >
          <template #activator="{ props }">
            <v-btn
              class="px-4"
              color="primary"
              size="large"
              :title="$t('recall.actions.deleteFood')"
              variant="text"
              v-bind="props"
            >
              <v-icon start>
                $delete
              </v-icon>
              {{ $t('recall.actions.deleteFood') }}
            </v-btn>
          </template>
          <i18n-t keypath="recall.menu.food.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
        </confirm-dialog>
        <v-btn
          class="px-4"
          color="primary"
          size="large"
          :title="$t('recall.actions.editFood')"
          variant="text"
          @click.stop="action('editFood', food?.id)"
        >
          <v-icon start>
            $edit
          </v-icon>
          {{ $t('recall.actions.editFood') }}
        </v-btn>
      </template>
      <template v-if="isMeal">
        <confirm-dialog
          :label="$t('recall.menu.meal.delete')"
          @confirm="action('deleteMeal', meal?.id)"
        >
          <template #activator="{ props }">
            <v-btn
              class="px-4"
              color="primary"
              size="large"
              :title="$t('recall.actions.deleteMeal')"
              variant="text"
              v-bind="props"
            >
              <v-icon start>
                $delete
              </v-icon>
              {{ $t('recall.actions.deleteMeal') }}
            </v-btn>
          </template>
          <i18n-t keypath="recall.menu.meal.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ mealName }}</span>
            </template>
          </i18n-t>
        </confirm-dialog>
        <v-btn
          class="px-4"
          color="primary"
          size="large"
          :title="$t('recall.actions.editMeal')"
          variant="text"
          @click.stop="action('editMeal', meal?.id)"
        >
          <v-icon start>
            $add
          </v-icon>
          {{ $t('recall.actions.editMeal') }}
        </v-btn>
      </template>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <template v-if="isFood">
        <confirm-dialog
          :label="$t('recall.menu.food.delete')"
          @confirm="action('deleteFood', food?.id)"
        >
          <template #activator="{ props }">
            <v-btn color="primary" variant="text" v-bind="props">
              <span class="text-overline font-weight-medium">
                {{ $t('recall.actions.nav.deleteFood') }}
              </span>
              <v-icon class="pb-1">
                $delete
              </v-icon>
            </v-btn>
          </template>
          <i18n-t keypath="recall.menu.food.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
        </confirm-dialog>
        <v-divider vertical />
        <v-btn color="primary" variant="text" @click.stop="action('editFood', food?.id)">
          <span class="text-overline font-weight-medium">
            {{ $t('recall.actions.nav.editFood') }}
          </span>
          <v-icon class="pb-1">
            $edit
          </v-icon>
        </v-btn>
        <v-divider vertical />
      </template>
      <template v-if="isMeal">
        <confirm-dialog
          :label="$t('recall.menu.meal.delete')"
          @confirm="action('deleteMeal', meal?.id)"
        >
          <template #activator="{ props }">
            <v-btn color="primary" variant="text" v-bind="props">
              <span class="text-overline font-weight-medium">
                {{ $t('recall.actions.nav.deleteMeal') }}
              </span>
              <v-icon class="pb-1">
                $delete
              </v-icon>
            </v-btn>
          </template>
          <i18n-t keypath="recall.menu.meal.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ mealName }}</span>
            </template>
          </i18n-t>
        </confirm-dialog>
        <v-divider vertical />
        <v-btn color="primary" variant="text" @click.stop="action('editMeal', meal?.id)">
          <span class="text-overline font-weight-medium">
            {{ $t('recall.actions.nav.editMeal') }}
          </span>
          <v-icon class="pb-1">
            $add
          </v-icon>
        </v-btn>
        <v-divider vertical />
      </template>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { usePromptUtils } from '@intake24/survey/composables';
import { ConfirmDialog } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'NoMoreInformationPrompt',

  components: { ConfirmDialog },

  mixins: [createBasePrompt<'no-more-information-prompt'>()],

  props: {
    modelValue: {
      type: String,
      default: 'next',
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { action, customPromptLayout, foodName, isFood, isMeal, mealName } = usePromptUtils(
      props,
      ctx,
    );

    const isValid = true;
    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
      },
    });

    return {
      action,
      customPromptLayout,
      foodName,
      isFood,
      isMeal,
      isValid,
      mealName,
      state,
    };
  },
});
</script>

<style lang="scss" scoped></style>
