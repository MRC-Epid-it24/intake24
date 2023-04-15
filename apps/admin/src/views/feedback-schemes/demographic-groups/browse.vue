<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <preview :feedback-scheme="currentFeedbackScheme"></preview>
    </template>
    <demographic-group-list
      v-model="form.demographicGroups"
      :scheme-id="id"
    ></demographic-group-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { DemographicGroupList, Preview } from '@intake24/admin/components/feedback';
import { createForm } from '@intake24/admin/util';

import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeDemographicGroupsForm = Pick<FeedbackSchemeForm, 'demographicGroups'>;

export default defineComponent({
  name: 'FeedbackSchemeDemographicGroups',

  components: { DemographicGroupList, Preview },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<FeedbackSchemeEntry>(props);

    return { entry, entryLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: createForm<FeedbackSchemeDemographicGroupsForm>({ demographicGroups: [] }),
    };
  },

  computed: {
    currentFeedbackScheme(): FeedbackSchemeEntry {
      return { ...this.entry, ...this.form.getData(true) } as FeedbackSchemeEntry;
    },
  },
});
</script>

<style lang="scss" scoped></style>
