<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <securables securableType="FeedbackScheme" :resourceId="id" :owner="entry.owner"></securables>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { Securables } from '@intake24/admin/components/securables';

export default defineComponent({
  name: 'FeedbackSchemeSecurables',

  components: { Securables },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<FeedbackSchemeEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
