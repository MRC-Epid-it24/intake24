<template>
  <div>
    <v-btn block class="button-bottom" large @click.stop="open">
      {{ $t('feedback.intake.tellMeMore') }}
    </v-btn>
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="600px"
      scrollable
    >
      <v-card :tile="$vuetify.breakpoint.smAndDown">
        <v-toolbar
          class="font-weight-medium text-h3 tell-me-more-title flex-grow-0"
          color="secondary lighten-1"
          dark
          flat
        >
          <v-btn dark icon :title="$t('common.action.ok')" @click.stop="close">
            <v-icon>$close</v-icon>
          </v-btn>
          <v-toolbar-title class="pl-2">{{ detail.name }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="flex-grow-0 flex-shrink-0 pt-2 pb-1">
          <div class="text-subtitle-1">
            <span class="font-weight-medium">{{ $t('feedback.intake.estimated') }}: </span>
            <span :class="detail.textClass">{{ detail.intake }} {{ detail.unit }}</span>
          </div>
          <div v-if="detail.recommendedIntake" class="text-subtitle-1">
            <span class="font-weight-medium">{{ $t('feedback.intake.recommended') }}: </span>
            {{ detail.recommendedIntake.toString() }}
            {{ detail.unit }}
          </div>
        </v-card-text>
        <v-card-text class="flex-grow-0 flex-shrink-0 pt-1 pb-2">
          <div v-html="detail.unitDescription"></div>
        </v-card-text>
        <v-divider class="mx-4 mb-4"></v-divider>
        <v-card-text class="overflow-y-auto">
          <div v-html="detail.description"></div>
        </v-card-text>
        <v-btn
          block
          class="button-bottom font-weight-bold flex-grow-0 flex-shrink-0"
          color="secondary lighten-2"
          large
          :title="$t('common.action.ok')"
          @click.stop="close"
        >
          <v-icon left>fas fa-thumbs-up</v-icon>
          {{ $t('feedback.intake.gotIt') }}
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { FeedbackDetails } from './card-details';

export default defineComponent({
  name: 'TellMeMore',

  props: {
    detail: {
      type: Object as PropType<FeedbackDetails>,
      required: true,
    },
  },

  data() {
    return { dialog: false };
  },

  methods: {
    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.tell-me-more-title {
  letter-spacing: 0.1rem;
}

.button-bottom {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
