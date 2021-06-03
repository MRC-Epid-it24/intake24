<template>
  <v-bottom-sheet persistent v-model="showMenu">
    <v-sheet class="text-center" height="20rem">
      <v-btn class="mt-6 mb-3" text color="red" @click="toggleMenu"> close </v-btn>
      <v-btn :block="isMobile" class="mb-3" large @click="onContextMenuAction('edit-foods')">
        {{ $t('prompts.editMeal.editMeal', { meal: name }) }}
      </v-btn>
      <v-btn :block="isMobile" class="mb-8" large @click="onContextMenuAction('edit-time')">
        {{ $t('prompts.editMeal.editTime', { meal: name }) }}
      </v-btn>
      <v-btn :block="isMobile" class="delete-button" large @click="deleteMeal">
        {{ $t('prompts.editMeal.deleteMeal', { meal: name }) }}
      </v-btn>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealMobileContextMenu',

  props: {
    show: Boolean,
    mealName: String,
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
      return this.mealName;
    },
  },
  methods: {
    toggleMenu() {
      this.$emit('toggleMobileMealContext');
    },
    onContextMenuAction(action: string) {
      this.$emit('meal-action', {
        mealIndex: this.$props.mealIndex,
        action,
      });
      this.$emit('toggleMobileMealContext');
    },
    deleteMeal() {
      this.$store.commit('survey/deleteMeal', this.$props.mealIndex);
      this.$emit('toggleMobileMealContext');
      this.$emit('complete');
    },
  },
});
</script>
<style lang="scss" scoped>
.delete-button {
  position: fixed;
  bottom: 10px;
  color: red;
}
</style>
