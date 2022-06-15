<template>
  <v-container fluid class="print-card pa-0">
    <v-row no-gutters class="print-card-header mt-2">
      <v-col cols="4">
        <v-img :src="backgroundImage" class="ml-4" :aspect-ratio="4 / 3" eager></v-img>
      </v-col>
      <v-col cols class="d-flex flex-column">
        <v-card-title class="font-weight-medium py-0">{{ detail.name }}</v-card-title>
        <v-card-text class="d-flex flex-column py-0 font-weight-medium">
          <i18n path="feedback.intake.your" tag="div" class="mb-2">
            <template v-slot:nutrient>
              <span>{{ detail.name.toLowerCase() }}</span>
            </template>
            <template v-slot:amount>
              <span :class="detail.textClass">{{ formatOutput(detail.intake, detail.unit) }}</span>
            </template>
          </i18n>
          <div v-if="detail.recommendedIntake" :class="detail.textClass">
            <v-icon left>{{ detail.iconClass }}</v-icon>
            <span>{{ formatOutput(detail.recommendedIntake, detail.unit) }}</span>
          </div>
          <div class="mt-auto" v-html="detail.unitDescription"></div>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card-text>
          <div v-html="detail.description"></div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';
import type { FeedbackCardParameters } from '@intake24/ui/feedback';
import { formatOutput, getDetails, getBackgroundImage } from '.';

export default defineComponent({
  name: 'PrintCard',

  props: {
    parameters: {
      type: Object as PropType<FeedbackCardParameters>,
      required: true,
    },
  },

  setup(props) {
    const detail = computed(() => getDetails[props.parameters.type](props.parameters));
    const backgroundImage = computed(() =>
      getBackgroundImage[props.parameters.type](props.parameters)
    );

    return {
      detail,
      backgroundImage,
      formatOutput,
    };
  },
});
</script>

<style lang="scss">
@media print {
  .print-card {
    // For card per-page
    // page-break-after: page;
    // break-after: page;

    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-card-header {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  }
}
</style>
