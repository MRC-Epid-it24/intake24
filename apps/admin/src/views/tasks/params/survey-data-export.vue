<template>
  <div>
    <v-card-title>{{ $t('tasks.params') }}</v-card-title>
    <v-row class="mx-0">
      <v-col cols="12" md="6">
        <v-text-field
          :value="surveyId"
          :label="$t('surveys.id')"
          hide-details="auto"
          name="surveyId"
          outlined
          @input="$emit('update:surveyId', $event)"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { TaskRefs } from '@intake24/common/types/http/admin';
import Vue from 'vue';

export default Vue.extend({
  name: 'SurveyDataExport',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    refs: {
      type: Object as () => TaskRefs,
      required: true,
    },
  },
});
</script>

<style scoped></style>
