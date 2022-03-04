<template>
  <v-card flat tile>
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="4">
          <v-img :src="backgroundImage" class="ml-4" :aspect-ratio="4 / 3" eager></v-img>
        </v-col>
        <v-col cols class="d-flex flex-column">
          <v-card-title class="font-weight-medium py-0">{{ detail.name }}</v-card-title>
          <v-card-text class="d-flex flex-column py-0">
            <div class="subtitle-1">
              <span class="font-weight-medium">{{ $t('feedback.intake.estimated') }}: </span>
              <span :class="detail.textClass">{{ detail.intake }} {{ detail.unit }}</span>
            </div>
            <div v-if="detail.recommendedIntake" class="subtitle-1">
              <span class="font-weight-medium">{{ $t('feedback.intake.recommended') }}: </span>
              {{ detail.recommendedIntake.toString() }}
              {{ detail.unit }}
            </div>
            <div class="mt-auto" v-html="detail.unitDescription"></div>
          </v-card-text>
        </v-col>
        <v-col cols="12">
          <v-card-text v-html="detail.description"></v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';
import { FeedbackCardParameters } from '@intake24/survey/feedback';
import { getDetails, getBackgroundImage } from '.';

export default defineComponent({
  name: 'GenericPrintCard',

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
    };
  },
});
</script>

<style lang="scss" scoped></style>
