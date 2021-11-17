<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" :items="breads" divider="/"></v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <v-btn @click="$router.back()"> back </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';

type BrdCrumbs = {
  text: string;
  disabled: boolean;
};

export default (Vue as VueConstructor<Vue & LocaleContent>).extend({
  name: 'RecallBreadCrumbs',

  mixins: [localeContent],

  data: () => {
    return {};
  },

  computed: {
    ...mapGetters('survey', ['selectedMeal', 'selectedMealIndex', 'selectedFood']),

    breads(): BrdCrumbs[] {
      const localMealName: string | null = this.selectedMeal
        ? this.getLocaleContent(this.selectedMeal.localName)
        : null;
      return [
        {
          text: localMealName !== null ? localMealName : this.$t('breadcrumbs.meal'),
          disabled: !this.selectedMeal,
        },
        {
          text: this.selectedFood ? this.selectedFood.name : this.$t('breadcrumbs.food'),
          disabled: !this.selectedFood,
        },
      ];
    },
  },
});
</script>
