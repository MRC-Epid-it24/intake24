<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" :items="brds" divider="/"></v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <v-btn @click="$router.back()"> back </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import breadcrumbs, { BreadCrumbsContent, BrdCrumbs } from '@/components/mixins/breadcrumbs';

export default (Vue as VueConstructor<Vue & BreadCrumbsContent>).extend({
  name: 'RecallBreadCrumbs',
  props: ['promptName'],

  mixins: [breadcrumbs],

  data: () => {
    return {};
  },

  computed: {
    ...mapGetters('survey', ['selectedMeal', 'selectedMealIndex', 'selectedFood']),

    brds(): BrdCrumbs[] {
      return this.getBreadCrumbs(this.promptName).filter((el) => !el.disabled);
    },
  },
});
</script>
