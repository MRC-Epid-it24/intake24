<template>
  <div>
    <div class="text-h3 text-center mb-4">{{ $t('feedback.physicalData.summary') }}</div>
    <div class="text-h6 text-center mb-4">{{ userInfo.physicalActivityLevel.name }}</div>
    <v-row justify="center" align="center">
      <v-col cols="auto" class="d-flex flex-column">
        <div>
          {{ $t('feedback.physicalData.weight', { weight: userInfo.physicalData.weightKg }) }}
        </div>
        <div>
          {{ $t('feedback.physicalData.height', { height: userInfo.physicalData.heightCm }) }}
        </div>
        <div>
          {{
            $t('feedback.physicalData.weightTarget', {
              target: $t(
                `feedback.physicalData.weightTargets.${userInfo.physicalData.weightTarget}`
              ),
            })
          }}
        </div>
      </v-col>
      <v-divider vertical class="d-none d-sm-block"></v-divider>
      <v-col cols="auto" class="d-flex flex-column">
        <v-btn
          link
          class="mb-2"
          color="primary"
          outlined
          :title="$t('feedback.physicalData.change')"
          :to="{ name: 'feedback-physical-data', params: { surveyId } }"
        >
          {{ $t('feedback.physicalData.change') }}
        </v-btn>
        <v-btn
          link
          color="primary"
          outlined
          :title="$t('feedback.physicalData.recall')"
          :to="{ name: 'survey-home', params: { surveyId } }"
        >
          {{ $t('feedback.physicalData.recall') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { UserDemographic } from '@intake24/survey/feedback';

export default defineComponent({
  name: 'FeedbackUserDemographicInfo',

  props: {
    userInfo: {
      type: Object as PropType<UserDemographic>,
      required: true,
    },
  },

  computed: {
    surveyId(): string {
      return this.$route.params.surveyId;
    },
  },
});
</script>

<style lang="scss" scoped></style>
