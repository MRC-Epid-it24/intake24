<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <preview :feedback-scheme="currentFeedbackScheme"></preview>
    </template>
    <card-list v-model="form.cards" :nutrient-types="refs?.nutrientTypes"></card-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry, FeedbackSchemeRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { CardList, Preview } from '@intake24/admin/components/feedback';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeFoodGroupsForm = Pick<FeedbackSchemeForm, 'cards'>;

export default defineComponent({
  name: 'FeedbackSchemeFoodGroups',

  components: { CardList, Preview },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs } = useEntry<FeedbackSchemeEntry, FeedbackSchemeRefs>(props);
    useEntryFetch(props);
    const { form, routeLeave, submit } = useEntryForm<
      FeedbackSchemeFoodGroupsForm,
      FeedbackSchemeEntry
    >(props, {
      data: { cards: [] },
      editMethod: 'patch',
    });

    return { entry, entryLoaded, refs, form, routeLeave, submit };
  },

  computed: {
    currentFeedbackScheme(): FeedbackSchemeEntry {
      return { ...this.entry, ...this.form.getData(true) } as FeedbackSchemeEntry;
    },
  },
});
</script>

<style lang="scss" scoped></style>
