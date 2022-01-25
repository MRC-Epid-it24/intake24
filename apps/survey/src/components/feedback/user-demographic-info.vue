<template>
  <div>
    <div class="text-h3 text-center mb-4">Summary of your diet</div>
    <div class="text-h5 text-center mb-4">Active or moderately active lifestyle</div>
    <v-row justify="center">
      <v-col cols="auto">
        Weight: {{ userInfo.physicalData.weightKg }} kg<br />
        Height: {{ userInfo.physicalData.heightCm }} cm<br />
        <v-btn link :to="{ name: 'feedback-physical-data', params: { surveyId } }">
          Change my info
        </v-btn>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="auto"></v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import UserDemographic from '@intake24/survey/feedback/user-demographic';
import Vue from 'vue';

export default Vue.extend({
  name: 'FeedbackUserDemographicInfo',

  props: {
    userInfo: {
      type: Object as () => UserDemographic,
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
