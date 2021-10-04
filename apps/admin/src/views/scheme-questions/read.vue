<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('schemes.questions.id') }}</th>
          <td>{{ entry.question.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.questions.name') }}</th>
          <td>{{ entry.question.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.questions.component') }}</th>
          <td>{{ entry.question.component }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.questions.type') }}</th>
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
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@/types';
import detailMixin from '@/components/entry/detailMixin';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'SchemeQuestionDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
