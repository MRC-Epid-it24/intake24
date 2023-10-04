<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template #actions>
      <template v-if="isFood">
        <confirm-dialog
          :label="$t('recall.menu.food.delete').toString()"
          @confirm="action('deleteFood', food?.id)"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              class="px-4"
              color="primary"
              large
              text
              :title="$t('recall.actions.deleteFood')"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>$delete</v-icon>
              {{ $t('recall.actions.deleteFood') }}
            </v-btn>
          </template>
          <i18n path="recall.menu.food.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
        </confirm-dialog>
        <v-btn
          class="px-4"
          color="primary"
          large
          text
          :title="$t('recall.actions.editFood')"
          @click.stop="action('editFood', food?.id)"
        >
          <v-icon left>$edit</v-icon>
          {{ $t('recall.actions.editFood') }}
        </v-btn>
      </template>
      <template v-if="isMeal">
        <confirm-dialog
          :label="$t('recall.menu.meal.delete').toString()"
          @confirm="action('deleteMeal', meal?.id)"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              class="px-4"
              color="primary"
              large
              text
              :title="$t('recall.actions.deleteMeal')"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>$delete</v-icon>
              {{ $t('recall.actions.deleteMeal') }}
            </v-btn>
          </template>
          <i18n path="recall.menu.meal.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ mealName }}</span>
            </template>
          </i18n>
        </confirm-dialog>
        <v-btn
          class="px-4"
          color="primary"
          large
          text
          :title="$t('recall.actions.editMeal')"
          @click.stop="action('editMeal', meal?.id)"
        >
          <v-icon left>$add</v-icon>
          {{ $t('recall.actions.editMeal') }}
        </v-btn>
      </template>
      <next :disabled="!isValid" @click="action('next')"></next>
    </template>
    <template #nav-actions>
      <template v-if="isFood">
        <confirm-dialog
          :label="$t('recall.menu.food.delete').toString()"
          @confirm="action('deleteFood', food?.id)"
        >
          <template #activator="{ on, attrs }">
            <v-btn color="primary" text v-bind="attrs" v-on="on">
              <span class="text-overline font-weight-medium">
                {{ $t('recall.actions.nav.deleteFood') }}
              </span>
              <v-icon class="pb-1">$delete</v-icon>
            </v-btn>
          </template>
          <i18n path="recall.menu.food.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
        </confirm-dialog>
        <v-divider vertical></v-divider>
        <v-btn color="primary" text @click.stop="action('editFood', food?.id)">
          <span class="text-overline font-weight-medium">
            {{ $t('recall.actions.nav.editFood') }}
          </span>
          <v-icon class="pb-1">$edit</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
      </template>
      <template v-if="isMeal">
        <confirm-dialog
          :label="$t('recall.menu.meal.delete').toString()"
          @confirm="action('deleteMeal', meal?.id)"
        >
          <template #activator="{ on, attrs }">
            <v-btn color="primary" text v-bind="attrs" v-on="on">
              <span class="text-overline font-weight-medium">
                {{ $t('recall.actions.nav.deleteMeal') }}
              </span>
              <v-icon class="pb-1">$delete</v-icon>
            </v-btn>
          </template>
          <i18n path="recall.menu.meal.deleteConfirm">
            <template #item>
              <span class="font-weight-medium">{{ mealName }}</span>
            </template>
          </i18n>
        </confirm-dialog>
        <v-divider vertical></v-divider>
        <v-btn color="primary" text @click.stop="action('editMeal', meal?.id)">
          <span class="text-overline font-weight-medium">
            {{ $t('recall.actions.nav.editMeal') }}
          </span>
          <v-icon class="pb-1">$add</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
      </template>
      <next-mobile :disabled="!isValid" @click="action('next')"></next-mobile>
    </template>
  </card-layout>
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
    value: {
      type: String,
      default: 'next',
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { action, foodName, isFood, isMeal, mealName } = usePromptUtils(props, ctx);

    const isValid = true;
    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
      },
    });

    return {
      action,
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
