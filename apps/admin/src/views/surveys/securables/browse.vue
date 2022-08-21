<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <securables securable-type="Survey" :resource-id="id" :owner="entry.owner"></securables>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SurveyEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { Securables } from '@intake24/admin/components/securables';

export default defineComponent({
  name: 'SurveySecurables',

  components: { Securables },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<SurveyEntry>(props.id);

    return { entry, entryLoaded };
  },
});
</script>

<style lang="scss" scoped></style>
