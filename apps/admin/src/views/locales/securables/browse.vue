<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <securables :owner="entry.owner" :resource-id="id" securable-type="Locale" />
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { detailMixin } from '@intake24/admin/components/entry';
import { Securables } from '@intake24/admin/components/securables';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';
import type { LocaleEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'LocaleSecurables',

  components: { Securables },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<LocaleEntry>(props);
    useEntryFetch(props);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
