<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" class="pl-0" divider="/" :items="breadcrumbs">
      <template #divider>
        <v-icon x-small>fa-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <confirm-dialog label="Reset survey state" @confirm="$emit('restart')">
      <template #activator="{ attrs, on }">
        <v-btn v-bind="attrs" class="mr-2" color="error" outlined v-on="on">
          <v-icon left>fas fa-times</v-icon>
          <span>Reset</span>
        </v-btn>
      </template>
      Reset survey state
    </confirm-dialog>
    <request-help :survey-id="$route.params.surveyId"></request-help>
  </v-toolbar>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { BreadcrumbsElement } from '@intake24/survey/components/mixins/breadcrumbs';
import { breadcrumbs } from '@intake24/survey/components/mixins';
import RequestHelp from '@intake24/survey/components/request-help.vue';
import { ConfirmDialog } from '@intake24/ui/components';

export default defineComponent({
  name: 'RecallBreadCrumbs',

  components: { RequestHelp, ConfirmDialog },

  mixins: [breadcrumbs],

  props: {
    promptName: {
      type: Object as PropType<RequiredLocaleTranslation>,
      required: true,
    },
  },

  computed: {
    breadcrumbs(): BreadcrumbsElement[] {
      return this.getBreadCrumbs(this.promptName);
    },
  },
});
</script>
