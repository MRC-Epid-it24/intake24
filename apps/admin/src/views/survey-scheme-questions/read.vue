<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('survey-schemes.questions.internal.id._') }}</th>
          <td>{{ entry.question.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.questions.internal.name._') }}</th>
          <td>{{ entry.question.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.questions.component') }}</th>
          <td>{{ entry.question.component }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.questions.type') }}</th>
          <td>{{ entry.question.type }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-container>
      <pre>{{ JSON.stringify(entry.question, null, '\t') }}</pre>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SurveySchemeQuestionEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

export default defineComponent({
  name: 'SchemeQuestionDetail',

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<SurveySchemeQuestionEntry>(props);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
