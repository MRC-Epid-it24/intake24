<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <securables :owner="entry.owner" :resource-id="id" securable-type="Survey" />
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { detailMixin } from '@intake24/admin/components/entry';
import { Securables } from '@intake24/admin/components/securables';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';
import type { SurveyEntry } from '@intake24/common/types/http/admin';

export default defineComponent({
  name: 'SurveySecurables',

  components: { Securables },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<SurveyEntry>(props);
    useEntryFetch(props);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
