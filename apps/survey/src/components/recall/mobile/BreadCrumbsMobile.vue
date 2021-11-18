<template>
  <v-toolbar flat dense class="brdcrmbs">
    <v-breadcrumbs :items="breads">
      <template v-slot:divider>
        <v-icon>{{ forwardIcon }}</v-icon>
      </template>
    </v-breadcrumbs>
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
  name: 'RecallBreadCrumbsMobile',

	mixins: [localeContent],

  props: {
    prompt: String,
  },

  data: () => {
    return {
      forwardIcon: 'fas fa-caret-right',
    };
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

<style lang="scss" scoped>
/* Style the food bar */

.brdcrmbs {
  position: sticky;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 1;
  //padding-top: 5px;
}
</style>
