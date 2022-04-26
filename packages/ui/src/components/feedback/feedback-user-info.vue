<template>
  <v-col cols="auto" class="d-flex flex-column">
    <div class="text-subtitle-1 font-weight-medium text-uppercase">
      {{ $t('feedback.physicalData.title') }}
    </div>
    <div class="text-subtitle-2">
      {{ userDemographic.physicalActivityLevel.name }}
    </div>
    <div class="text-subtitle-2">
      {{ $t('feedback.physicalData.weight', { weight: userDemographic.physicalData.weightKg }) }}
      |
      {{ $t('feedback.physicalData.height', { height: userDemographic.physicalData.heightCm }) }}
    </div>
    <div class="text-subtitle-2">
      {{
        $t('feedback.physicalData.weightTarget', {
          target: $t(
            `feedback.physicalData.weightTargets.${userDemographic.physicalData.weightTarget}`
          ),
        })
      }}
    </div>
    <v-btn
      link
      class="mt-2"
      color="primary"
      block
      outlined
      :title="$t('feedback.physicalData.change')"
      :to="{ name: 'feedback-physical-data', params: { surveyId } }"
    >
      <v-icon left>fas fa-person-running</v-icon>
      {{ $t('feedback.physicalData.change') }}
    </v-btn>
    <v-btn
      link
      class="mt-2"
      color="primary"
      outlined
      :title="$t('feedback.physicalData.recall')"
      :to="{ name: 'survey-home', params: { surveyId } }"
    >
      <v-icon left>fas fa-bowl-food</v-icon>
      {{ $t('feedback.physicalData.recall') }}
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import type { UserDemographic } from '@intake24/ui/feedback';

export default defineComponent({
  name: 'FeedbackUserInfo',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    userDemographic: {
      type: Object as PropType<UserDemographic>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
