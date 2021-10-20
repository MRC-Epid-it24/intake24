<template>
  <v-row justify="center" align="center" class="pt-2">
    <v-col cols="12" md="6">
      <v-card>
        <v-sheet class="d-flex justify-center" color="deep-orange lighten-5" tile>
          <v-card-title>
            <h2>{{ $t('common._') }}</h2>
          </v-card-title>
        </v-sheet>
        <v-card-text class="d-flex flex-column flex-sm-row justify-center align-center pa-6">
          <v-icon class="mr-sm-6" color="warning" large>fa-exclamation-triangle</v-icon>
          <span class="text-subtitle-1">
            Oops ... Something went wrong. Survey could not be loaded.
          </span>
        </v-card-text>
        <v-card-text class="pa-6">
          <div class="text-subtitle-2">Details</div>
          <p>Network error</p>
        </v-card-text>
        <v-divider class="mx-6"></v-divider>
        <router-link
          class="text-decoration-none"
          :to="{ name: 'survey-dashboard', params: { surveyId: this.$route.params.surveyId } }"
        >
          <div class="d-flex flex-column flex-sm-row justify-center align-center py-6" v-ripple>
            <v-icon class="py-3 mr-sm-6" size="100">fa-sync-alt</v-icon>
            <span class="py-3 text-h3 font-weight-bold text--secondary text-uppercase">
              {{ $t('common.reload') }}
            </span>
          </div>
        </router-link>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'SurveyError',

  computed: {
    ...mapGetters('survey', ['error']),
  },
});
</script>
<style lang="scss" scoped></style>
