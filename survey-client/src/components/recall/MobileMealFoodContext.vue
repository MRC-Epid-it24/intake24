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
      <v-btn v-if="!entityType" block class="mb-0 delete-button" md="8" large @click="deleteMeal">
        {{ $t('prompts.editMeal.deleteMeal', { meal: name }) }}
      </v-btn>
      <v-btn v-else block class="mb-0 delete-button" md="8" large @click="deleteFood">
        {{ $t('prompts.editMeal.deleteFoodFromMeal', { food: name }) }}
      </v-btn>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealFoodMobileContextMenu',

  props: {
    show: Boolean,
    entityName: String,
    entityIndex: Number,
    entityType: Boolean,
    mealIndex: Number,
  },
  data() {
    return {};
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
<style lang="scss" scoped>
.delete-button {
  color: red;
}
</style>
