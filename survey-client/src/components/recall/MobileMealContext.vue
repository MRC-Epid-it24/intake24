<template>
  <v-bottom-sheet persistent v-model="showMenu">
    <v-sheet class="text-center" height="200px">
      <v-btn class="mt-6" text color="red" @click="toggleMenu"> close </v-btn>
      <div class="py-3">
        {{ name }}
      </div>
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
  },
});
</script>
