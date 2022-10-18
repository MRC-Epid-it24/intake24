<template>
  <div>
    <v-btn block class="button-bottom" large @click.stop="open">
      {{ $t('feedback.intake.tellMeMore') }}
    </v-btn>
    <v-dialog v-model="dialog" max-width="600px" scrollable>
      <v-card>
        <v-toolbar flat>
          <v-icon left>fa-utensils</v-icon>
          <v-toolbar-title class="font-weight-medium text-h3 tell-me-more-title">
            {{ detail.name }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon :title="$t('common.action.ok')" @click.stop="close">
              <v-icon>$close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="d-flex justify-space-between">
          <div class="subtitle-1">
            <span class="font-weight-medium">{{ $t('feedback.intake.estimated') }}: </span>
            <span :class="detail.textClass">{{ detail.intake }} {{ detail.unit }}</span>
          </div>
          <div v-if="detail.recommendedIntake" class="subtitle-1">
            <span class="font-weight-medium">{{ $t('feedback.intake.recommended') }}: </span>
            {{ detail.recommendedIntake.toString() }}
            {{ detail.unit }}
          </div>
        </v-card-text>
        <v-card-text class="d-flex">
          <div v-html="detail.unitDescription"></div>
        </v-card-text>
        <v-divider class="mx-4 mb-4"></v-divider>
        <v-card-text>
          <div v-html="detail.description"></div>
        </v-card-text>
        <v-btn
          block
          class="button-bottom font-weight-bold"
          color="primary lighten-2"
          large
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
