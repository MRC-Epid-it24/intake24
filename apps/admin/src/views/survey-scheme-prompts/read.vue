<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('survey-schemes.prompts.internal.id._') }}</th>
          <td>{{ entry.prompt.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.prompts.internal.name._') }}</th>
          <td>{{ entry.prompt.name }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.prompts.component') }}</th>
          <td>{{ entry.prompt.component }}</td>
        </tr>
        <tr>
          <th>{{ $t('survey-schemes.prompts.type') }}</th>
          <td>{{ entry.prompt.type }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-container fluid>
      <pre>{{ JSON.stringify(entry.prompt, null, '\t') }}</pre>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SurveySchemePromptEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';

export default defineComponent({
  name: 'SchemePromptDetail',

  mixins: [detailMixin],

  setup(props) {
    useEntryFetch(props);
    const { entry, entryLoaded } = useEntry<SurveySchemePromptEntry>(props);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
