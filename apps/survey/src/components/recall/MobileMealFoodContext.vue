<template>
  <v-bottom-sheet v-model="showMenu" persistent>
    <v-sheet class="text-center pa-3" height="20rem">
      <v-btn class="mt-6 mb-3" color="red" text @click="toggleMenu"> close </v-btn>
      <v-btn v-if="!entityType" block class="mb-3" large @click="onContextMenuAction('edit-foods')">
        {{ $t('prompts.editMeal.editMeal', { meal: name }) }}
      </v-btn>
      <v-btn v-if="!entityType" block class="mb-8" large @click="onContextMenuAction('edit-time')">
        {{ $t('prompts.editMeal.editTime', { meal: name }) }}
      </v-btn>
      <confirm-dialog
        color="error"
        :label="$t('prompts.editMeal.deleteMeal', { meal: name })"
        @confirm="deleteEntity"
      >
        <template #activator="{ on, attrs }">
          <v-btn block class="px-5" color="error" large v-bind="attrs" v-on="on">
            {{ $t('prompts.editMeal.deleteMeal', { meal: name }) }}
          </v-btn>
        </template>
        {{ $t('prompts.mealDelete.message', { meal: name }) }}
      </confirm-dialog>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import { useSurvey } from '@intake24/survey/stores';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'MealFoodMobileContextMenu',

  components: { ConfirmDialog },

  props: {
    show: Boolean,
    entityName: String,
    entityIndex: Number,
    entityType: Boolean,
    mealIndex: Number,
  },

  computed: {
    showMenu(): boolean {
      return this.show;
    },
    name(): string | undefined {
      return this.entityName;
    },
  },

  methods: {
    ...mapActions(useSurvey, { storeDeleteMeal: 'deleteMeal', storeDeleteFood: 'deleteFood' }),

    toggleMenu() {
      this.$emit('toggleMobileMealContext');
    },

    onContextMenuAction(action: string) {
      this.$emit('meal-action', {
        mealIndex: this.$props.entityIndex,
        action,
      });
      this.$emit('toggleMobileMealContext');
    },

    deleteEntity() {
      if (!this.entityType) this.deleteMeal();
      else this.deleteFood();
    },

    deleteMeal() {
      const { entityIndex } = this;
      if (entityIndex === undefined) {
        console.log(`Missing entityIndex`);
        return;
      }

      this.storeDeleteMeal(entityIndex);
      this.$emit('toggleMobileMealContext');
      this.$emit('complete');
    },

    deleteFood() {
      const { mealIndex, entityIndex: foodIndex } = this;
      if (mealIndex === undefined || foodIndex === undefined) {
        console.log(`Missing mealIndex / foodIndex`);
        return;
      }

      this.storeDeleteFood({ mealIndex, foodIndex });
      this.$emit('toggleMobileMealContext');
    },
  },
});
</script>
<style lang="scss" scoped></style>
