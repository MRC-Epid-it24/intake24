<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <v-card-title>Dashboard</v-card-title>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          x-large
          class="pa-6"
          color="success"
          :to="{ name: 'survey-recall', params: { surveyId } }"
        >
          Dynamic recall
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          x-large
          class="pa-6"
          color="success"
          :to="{ name: 'survey-portion-test', params: { surveyId } }"
        >
          Portions test
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'SurveyDashboard',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },
});
</script>
