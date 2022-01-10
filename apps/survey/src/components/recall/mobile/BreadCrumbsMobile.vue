<template>
  <v-toolbar
    flat
    dense
    class="brdcrmbs"
    style="overflow-y: hidden; overflow-x: scroll; white-space: nowrap"
  >
    <v-breadcrumbs :items="brds">
      <template v-slot:divider>
        <v-icon>{{ forwardIcon }}</v-icon>
      </template>
    </v-breadcrumbs>
  </v-toolbar>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import breadcrumbs, {
  BreadCrumbsContent,
  BrdCrumbs,
} from '@intake24/survey/components/mixins/breadcrumbs';

export default (Vue as VueConstructor<Vue & BreadCrumbsContent>).extend({
  name: 'RecallBreadCrumbsMobile',
  props: ['promptName'],

  mixins: [breadcrumbs],

  data: () => {
    return {
      forwardIcon: 'fas fa-caret-right',
    };
  },

  computed: {
    ...mapGetters('survey', ['selectedMeal', 'selectedMealIndex', 'selectedFood']),

    brds(): BrdCrumbs[] {
      return this.getBreadCrumbs(this.promptName).filter((el) => !el.disabled);
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
