<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <template #actions>
      <confirm-dialog
        v-if="food"
        color="error"
        :label="$t('prompts.editMeal.delete._', { item: localeFoodName }).toString()"
        @confirm="action('deleteFood', food?.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :block="isMobile"
            class="px-4"
            color="error"
            large
            :title="$t('recall.actions.deleteFood')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>$delete</v-icon>
            {{ $t('recall.actions.deleteFood') }}
          </v-btn>
        </template>
        {{ $t('prompts.editMeal.delete.confirm', { item: localeFoodName }) }}
      </confirm-dialog>
      <template v-if="meal">
        <confirm-dialog
          color="error"
          :label="$t('prompts.editMeal.delete._', { item: localeMealName }).toString()"
          @confirm="action('deleteMeal', meal?.id)"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              :block="isMobile"
              class="px-4"
              color="error"
              large
              :title="$t('recall.actions.deleteMeal')"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>$delete</v-icon>
              {{ $t('recall.actions.deleteMeal') }}
            </v-btn>
          </template>
          {{ $t('prompts.editMeal.delete.confirm', { item: localeMealName }) }}
        </confirm-dialog>
        <v-btn
          :block="isMobile"
          class="px-4"
          large
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
      <template v-if="food">
        <confirm-dialog
          color="error"
          :label="$t('prompts.editMeal.delete._', { item: localeFoodName }).toString()"
          @confirm="action('deleteFood', food?.id)"
        >
          <template #activator="{ on, attrs }">
            <v-btn color="error" value="deleteFood" v-bind="attrs" v-on="on">
              <span class="text-overline font-weight-medium">
                {{ $t('recall.actions.nav.deleteFood') }}
              </span>
              <v-icon class="pb-1">$delete</v-icon>
            </v-btn>
          </template>
          {{ $t('prompts.editMeal.delete.confirm', { item: localeFoodName }) }}
        </confirm-dialog>
        <v-divider vertical></v-divider>
      </template>
      <template v-if="meal">
        <confirm-dialog
          color="error"
          :label="$t('prompts.editMeal.delete._', { item: localeMealName }).toString()"
          @confirm="action('deleteMeal', meal?.id)"
        >
          <template #activator="{ on, attrs }">
            <v-btn color="error" value="deleteMeal" v-bind="attrs" v-on="on">
              <span class="text-overline font-weight-medium">
                {{ $t('recall.actions.nav.deleteMeal') }}
              </span>
              <v-icon class="pb-1">$delete</v-icon>
            </v-btn>
          </template>
          {{ $t('prompts.editMeal.delete.confirm', { item: localeMealName }) }}
        </confirm-dialog>
        <v-divider vertical></v-divider>
        <v-btn value="editMeal" @click.stop="action('editMeal', meal?.id)">
          <span class="text-overline font-weight-medium">
            {{ $t('recall.actions.nav.editMeal') }}
          </span>
          <v-icon class="pb-1">$add</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
      </template>
      <v-btn color="success" :disabled="!isValid" value="next" @click.stop="action('next')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.next') }}
        </span>
        <v-icon class="pb-1">$next</v-icon>
      </v-btn>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ConfirmDialog } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'NoMoreInformationPrompt',

  components: { ConfirmDialog },

  mixins: [createBasePrompt<'no-more-information-prompt'>()],

  emits: ['update'],

  data() {
    return {
      currentValue: 'ok',
    };
  },

  computed: {
    isValid(): boolean {
      return true;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue });
    },

    confirm() {
      this.update();
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
