<template>
  <v-row justify="center" align="center" class="pt-2">
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>Intake24</v-card-title>
        <v-card-subtitle></v-card-subtitle>
        <v-card-text>
          <v-alert border="left" colored-border color="deep-purple accent-4" elevation="0">
            Something went wrong. We could not loaded the survey settings.
          </v-alert>
        </v-card-text>
        <a @click.stop="reload">
          <v-card-text class="d-flex flex-column" v-ripple>
            <v-icon size="100">fa-sync-alt</v-icon>
          </v-card-text>
        </a>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SurveyError',

  data() {
    return {};
  },

  methods: {
    reload() {
      this.$router.push({ name: 'recall', params: { surveyId: this.$route.params.surveyId } });
    },
  },
});
</script>
<style lang="scss" scoped></style>
