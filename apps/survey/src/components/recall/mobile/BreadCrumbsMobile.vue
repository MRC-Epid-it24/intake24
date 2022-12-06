<template>
  <v-toolbar class="breadcrumbs" dense flat style="overflow-y: hidden; white-space: nowrap">
    <v-breadcrumbs class="pl-1" :items="items">
      <template #divider>
        <v-icon>{{ forwardIcon }}</v-icon>
      </template>
    </v-breadcrumbs>
    <v-spacer></v-spacer>
    <confirm-dialog label="Reset survey state" @confirm="$emit('restart')">
      <template #activator="{ attrs, on }">
        <v-btn v-bind="attrs" class="mr-2" color="error" icon small v-on="on">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </template>
      Reset survey state
    </confirm-dialog>
    <request-help :survey-id="$route.params.surveyId">
      <template #activator="{ attrs, on }">
        <v-btn
          v-bind="attrs"
          color="grey"
          dark
          icon
          small
          :title="$t('common.help.title')"
          v-on="on"
        >
          <v-icon>$info</v-icon>
        </v-btn>

        <!-- <v-btn v-bind="attrs" class="mr-2" color="error" icon v-on="on">
          <v-icon>fas fa-times</v-icon>
        </v-btn> -->
      </template>
    </request-help>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import breadcrumbsMixin from '../breadcrumbs-mixin';

export default defineComponent({
  name: 'RecallBreadCrumbsMobile',

  mixins: [breadcrumbsMixin],

  computed: {
    items() {
      return this.getBreadCrumbs().filter((el) => !el.disabled);
    },
  },
});
</script>

<style lang="scss" scoped>
/* Style the food bar */
.breadcrumbs {
  position: sticky;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 1;
  border-bottom: 1px solid #cecdcdde;
  //padding-top: 5px;
}
</style>
