<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <preview :feedbackScheme="currentFeedbackScheme"></preview>
    </template>
    <demographic-group-list
      v-model="form.demographicGroups"
      :scheme-id="id"
    ></demographic-group-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { form } from '@intake24/admin/helpers';
import { DemographicGroupList, Preview } from '@intake24/admin/components/feedback';
import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeDemographicGroupsForm = Pick<FeedbackSchemeForm, 'demographicGroups'>;

export default defineComponent({
  name: 'FeedbackSchemeDemographicGroups',

  components: { DemographicGroupList, Preview },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<FeedbackSchemeEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<FeedbackSchemeDemographicGroupsForm>({ demographicGroups: [] }),
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
