<template>
  <v-bottom-navigation v-if="isMobile" class="d-print-none" color="secondary" fixed grow>
    <v-btn :to="{ name: 'survey-home', params: { surveyId } }">
      <span>{{ $t('common.home') }}</span>
      <v-icon>$home</v-icon>
    </v-btn>
    <v-btn v-if="recall" :to="{ name: 'survey-recall', params: { surveyId } }">
      <span>{{ $t('recall._') }}</span>
      <v-icon>$survey</v-icon>
    </v-btn>
    <v-btn v-if="feedback" :to="{ name: 'feedback-home', params: { surveyId } }">
      <span>{{ $t('feedback._') }}</span>
      <v-icon>$feedback</v-icon>
    </v-btn>
    <v-btn :to="{ name: 'survey-profile' }">
      <span>{{ $t('profile._') }}</span>
      <v-icon>$profile</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppNavigation',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    recall: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped></style>
