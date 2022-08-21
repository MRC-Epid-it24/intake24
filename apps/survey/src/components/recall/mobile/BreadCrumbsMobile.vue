<template>
  <v-toolbar flat dense class="brdcrmbs" style="overflow-y: hidden; white-space: nowrap">
    <v-breadcrumbs :items="brds" class="pl-1">
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
import type { BrdCrumbs } from '@intake24/survey/components/mixins/breadcrumbs';
import { breadcrumbs } from '@intake24/survey/components/mixins';

export default defineComponent({
  name: 'RecallBreadCrumbsMobile',

  mixins: [breadcrumbs],

  props: {
    promptName: {
      type: Object as PropType<RequiredLocaleTranslation>,
    },
  },

  data: () => {
    return {
      forwardIcon: 'fas fa-caret-right',
    };
  },

  computed: {
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
