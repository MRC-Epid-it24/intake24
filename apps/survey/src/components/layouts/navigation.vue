<template>
  <v-bottom-navigation v-if="$vuetify.display.mobile" class="d-print-none" color="primary" grow>
    <v-btn :to="{ name: 'survey-home', params: { surveyId } }">
      <v-icon>$home</v-icon>
      <span>{{ $t('common.home') }}</span>
    </v-btn>
    <v-btn v-if="recall" :to="{ name: 'survey-recall', params: { surveyId } }">
      <v-icon>$survey</v-icon>
      <span>{{ $t('recall._') }}</span>
    </v-btn>
    <v-btn v-if="feedback" :to="{ name: 'feedback-home', params: { surveyId } }">
      <v-icon>$feedback</v-icon>
      <span>{{ $t('feedback._') }}</span>
    </v-btn>
    <v-btn :to="{ name: 'survey-profile' }">
      <v-icon>$profile</v-icon>
      <span>{{ $t('profile._') }}</span>
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
