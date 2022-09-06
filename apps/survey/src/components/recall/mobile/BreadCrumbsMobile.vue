<template>
  <v-toolbar class="brdcrmbs" dense flat style="overflow-y: hidden; white-space: nowrap">
    <v-breadcrumbs class="pl-1" :items="breadcrumbs">
      <template #divider>
        <v-icon>{{ forwardIcon }}</v-icon>
      </template>
    </v-breadcrumbs>
  </v-toolbar>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { BreadcrumbsElement } from '@intake24/survey/components/mixins/breadcrumbs';
import { breadcrumbs } from '@intake24/survey/components/mixins';

export default defineComponent({
  name: 'RecallBreadCrumbsMobile',

  mixins: [breadcrumbs],

  props: {
    promptName: {
      type: Object as PropType<RequiredLocaleTranslation>,
      required: true,
    },
  },

  data: () => {
    return {
      forwardIcon: 'fas fa-caret-right',
    };
  },

  computed: {
    breadcrumbs(): BreadcrumbsElement[] {
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
  border-bottom: 1px solid #cecdcdde;
  //padding-top: 5px;
}
</style>
