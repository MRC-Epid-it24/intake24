<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-row>
      <v-col cols="12" md="6">
        <v-simple-table>
          <tbody>
            <tr>
              <th>{{ $t('as-served.id') }}</th>
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
        <v-card-title>{{ $t('as-served.selectionImage') }}</v-card-title>
        <v-img class="ma-2" :src="entry.selectionImageUrl"></v-img>
      </v-col>
    </v-row>
    <as-served-images :setId="entry.id" :items="entry.images" disabled></as-served-images>
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
    const { entry, entryLoaded } = useStoreEntry<AsServedSetEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss"></style>
