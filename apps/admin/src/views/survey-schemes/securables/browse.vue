<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <securables securableType="SurveyScheme" :resourceId="id" :owner="entry.owner"></securables>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SurveySchemeEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { Securables } from '@intake24/admin/components/securables';

export default defineComponent({
  name: 'SurveySchemeSecurables',

  components: { Securables },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<SurveySchemeEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
