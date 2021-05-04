<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('schemes.name') }}</th>
          <td>{{ entry.name }}</td>
        </tr>
      </tbody>
    </v-simple-table>

    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('schemes.questions.id') }}</th>
          <td>{{ entry.prompt.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.questions.name') }}</th>
          <td>{{ entry.prompt.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.questions.component') }}</th>
          <td>{{ entry.prompt.component }}</td>
        </tr>
        <tr>
          <th>{{ $t('schemes.questions.type') }}</th>
          <td>{{ entry.prompt.type }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-container>
      <code>
        <pre>
        {{ JSON.stringify(entry.prompt, null, '\t') }}
        </pre>
      </code>
    </v-container>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { DetailMixin } from '@/types/vue';
import detailMixin from '@/components/entry/detailMixin';

export default (Vue as VueConstructor<Vue & DetailMixin>).extend({
  name: 'SchemeQuestionDetail',

  mixins: [detailMixin],
});
</script>

<style lang="scss" scoped></style>
