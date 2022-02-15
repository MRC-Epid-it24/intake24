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
      <v-col cols="12" md="6">
        <v-text-field
          :value="file"
          :label="$t('common.file')"
          hide-details="auto"
          name="file"
          outlined
          @input="$emit('update:file', $event)"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { TaskRefs } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'SurveyImportRespondents',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    refs: {
      type: Object as PropType<TaskRefs>,
      required: true,
    },
  },
});
</script>

<style scoped></style>
