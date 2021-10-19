<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <v-card-title>Dashboard</v-card-title>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn x-large class="pa-6" color="success" :to="{ name: 'recall', params: { surveyId } }">
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
          :to="{ name: 'portion-test', params: { surveyId } }"
        >
          Portions test
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Dashboard',

  props: {
    surveyId: {
      type: String,
    },
  },
});
</script>
