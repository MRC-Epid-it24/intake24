<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-row>
      <v-col cols="12" md="6">
        <v-simple-table>
          <tbody>
            <tr>
              <th>{{ $t('as-served-sets.id') }}</th>
              <td>{{ entry.id }}</td>
            </tr>
            <tr>
              <th>{{ $t('common.description') }}</th>
              <td>{{ entry.description }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-title>{{ $t('as-served-sets.selectionImage') }}</v-card-title>
        <v-img class="ma-2" :src="entry.selectionImageUrl"></v-img>
      </v-col>
    </v-row>
    <as-served-images disabled :items="entry.images" :set-id="entry.id"></as-served-images>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { AsServedSetEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

import AsServedImages from './images.vue';

export default defineComponent({
  name: 'AsServedDetail',

  components: { AsServedImages },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<AsServedSetEntry>(props);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss"></style>
