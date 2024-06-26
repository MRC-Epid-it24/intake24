<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <preview :feedback-scheme="currentFeedbackScheme" />
    </template>
    <henry-coefficient-list v-model="form.henryCoefficients" />
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { HenryCoefficientList, Preview } from '@intake24/admin/components/feedback';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';

import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeHenryCoefficientsForm = Pick<FeedbackSchemeForm, 'henryCoefficients'>;

export default defineComponent({
  name: 'FeedbackSchemeHenryCoefficients',

  components: { HenryCoefficientList, Preview },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<FeedbackSchemeEntry>(props);
    useEntryFetch(props);
    const { form, routeLeave, submit } = useEntryForm<
      FeedbackSchemeHenryCoefficientsForm,
      FeedbackSchemeEntry
    >(props, {
      data: { henryCoefficients: [] },
      editMethod: 'patch',
    });

    return { entry, entryLoaded, form, routeLeave, submit };
  },

  computed: {
    currentFeedbackScheme(): FeedbackSchemeEntry {
      return { ...this.entry, ...this.form.getData(true) } as FeedbackSchemeEntry;
    },
  },
});
</script>

<style lang="scss" scoped></style>
