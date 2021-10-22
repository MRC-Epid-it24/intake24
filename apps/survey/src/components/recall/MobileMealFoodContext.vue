<template>
  <v-bottom-sheet persistent v-model="showMenu">
    <v-sheet class="text-center pa-3" height="20rem">
      <v-btn class="mt-6 mb-3" text color="red" @click="toggleMenu"> close </v-btn>
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
        <template v-slot:activator="{ on, attrs }">
          <v-btn block class="px-5" large color="error" v-bind="attrs" v-on="on">
            {{ $t('prompts.editMeal.deleteMeal', { meal: name }) }}
          </v-btn>
        </template>
        {{ $t('prompts.mealDelete.message', { meal: name }) }}
      </confirm-dialog>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import Vue from 'vue';
import ConfirmDialog from '@/components/elements/ConfirmDialog.vue';

export default Vue.extend({
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
    showMenu() {
      return this.show;
    },
    name() {
      return this.entityName;
    },
  },

  methods: {
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
      this.$store.commit('survey/deleteMeal', this.$props.entityIndex);
      this.$emit('toggleMobileMealContext');
      this.$emit('complete');
    },

    deleteFood() {
      this.$store.commit('survey/deleteFood', {
        mealIndex: this.$props.mealIndex,
        foodIndex: this.$props.entityIndex,
      });
      this.$emit('toggleMobileMealContext');
    },
  },
});
</script>
<style lang="scss" scoped></style>
