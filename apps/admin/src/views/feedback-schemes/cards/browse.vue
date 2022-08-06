<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <preview :feedbackScheme="currentFeedbackScheme"></preview>
    </template>
    <card-list v-model="form.cards" :scheme-id="id"></card-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { CardList, Preview } from '@intake24/admin/components/feedback';
import { form } from '@intake24/admin/helpers';

import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeFoodGroupsForm = Pick<FeedbackSchemeForm, 'cards'>;

export default defineComponent({
  name: 'FeedbackSchemeFoodGroups',

  components: { CardList, Preview },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<FeedbackSchemeEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<FeedbackSchemeFoodGroupsForm>({ cards: [] }),
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
