<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave">
    <v-container>
      Has food ranking data (last uploaded at time) / no ranking data
      <confirm-dialog
        color="error"
        icon-left="$delete"
        :label="$t('common.action.delete').toString()"
        @confirm="deleteRankingData"
      >
        {{ $t('common.action.confirm.delete', { name: 'Food ranking data' }) }}
      </confirm-dialog>

      <v-btn color="success">Upload</v-btn>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  LocaleEntry,
  LocaleSynonymSet,
  LocaleSynonymSetInput,
} from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { ConfirmDialog } from '@intake24/ui';

export type LocaleSynonymSetsForm = { items: LocaleSynonymSetInput[] };

export default defineComponent({
  name: 'LocaleSynonymSets',

  components: { ConfirmDialog },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<LocaleEntry>(props.id);

    return { entry, entryLoaded };
  },

  methods: {
    deleteRankingData() {
      throw new Error('Not implemented');
    },
  },
});
</script>

<style lang="scss" scoped></style>
