<template>
  <v-row justify="center">
    <v-col cols="12" md="10">
      <v-card min-height="30rem" class="d-flex justify-center align-center">
        <v-btn class="pa-10" color="success" x-large @click="startRecall">Start recall</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import recall from '@/util/Recall';
import { SurveyEntryResponse } from '@common/types/http';

export default Vue.extend({
  name: 'RecallEntry',

  props: {
    surveyId: {
      type: String,
    },
  },

  data() {
    return {
      recall,
    };
  },

  computed: {
    survey(): SurveyEntryResponse | null {
      return this.$store.state.recall.survey;
    },
  },

  async mounted() {
    if (this.survey?.scheme) this.recall.init(this.survey.scheme);
  },

  methods: {
    startRecall() {
      if (!this.recall.isInitialized()) return;

      const selection = this.recall.start();
      if (!selection) return;

      this.$router.push({
        name: `recall-${selection.section}`,
        params: { surveyId: this.surveyId, questionId: selection.prompt.question.id },
      });
    },
  },
});
</script>

<style lang="scss"></style>
