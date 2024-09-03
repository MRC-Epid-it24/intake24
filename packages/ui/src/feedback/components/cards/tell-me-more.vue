<template>
  <div>
    <v-btn
      block
      class="button-bottom rounded-t-0"
      :class="textColor"
      :color="detail.color"
      elevation="0"
      large
      @click.stop="open"
    >
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
          <v-toolbar-title class="pl-2">
            {{ detail.name }}
          </v-toolbar-title>
        </v-toolbar>
        <template v-if="detail.showIntake.includes('description') || detail.unitDescription">
          <v-card-text v-if="detail.showIntake.includes('description')" class="flex-grow-0 flex-shrink-0 pt-4 pb-0">
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
          <v-card-text v-if="detail.unitDescription" class="flex-grow-0 flex-shrink-0 pt-4 pb-0">
            <div v-html="detail.unitDescription" />
          </v-card-text>
          <v-divider class="mx-4 mt-2" />
        </template>
        <v-card-text v-if="detail.description" class="pt-4 overflow-y-auto">
          <div v-html="detail.description" />
        </v-card-text>
        <v-btn
          block
          class="button-bottom rounded-t-0 font-weight-bold flex-grow-0 flex-shrink-0"
          :class="{
            'rounded-b-0': $vuetify.breakpoint.smAndDown,
          }"
          color="secondary lighten-2"
          large
          :title="$t('common.action.ok')"
          @click.stop="close"
        >
          <v-icon left>
            fas fa-thumbs-up
          </v-icon>
          {{ $t('feedback.intake.gotIt') }}
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { FeedbackDetails } from './card-details';

export default defineComponent({
  name: 'TellMeMore',

  props: {
    detail: {
      type: Object as PropType<FeedbackDetails>,
      required: true,
    },
    textColor: {
      type: String,
    },
  },

  setup() {
    const dialog = ref(false);

    const open = () => {
      dialog.value = true;
    };

    const close = () => {
      dialog.value = false;
    };

    return { dialog, open, close };
  },
});
</script>

<style lang="scss" scoped>
.tell-me-more-title {
  letter-spacing: 0.1rem;
}

.button-bottom {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.075);
  }
}
</style>
