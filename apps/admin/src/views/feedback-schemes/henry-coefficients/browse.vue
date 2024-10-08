<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <template #actions>
      <preview :feedback-scheme="currentFeedbackScheme" :images="refs?.images" />
    </template>
    <henry-coefficient-list v-model="form.henryCoefficients" />
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import type { FeedbackSchemeEntry, FeedbackSchemeRefs } from '@intake24/common/types/http/admin';
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
    const { entry, entryLoaded, refs } = useEntry<FeedbackSchemeEntry, FeedbackSchemeRefs>(props);
    useEntryFetch(props);
    const { form, routeLeave, submit } = useEntryForm<
      FeedbackSchemeHenryCoefficientsForm,
      FeedbackSchemeEntry
    >(props, {
      data: { henryCoefficients: [] },
      editMethod: 'patch',
    });

    const currentFeedbackScheme = computed(() => ({ ...entry.value, ...form.getData() }));

    return { currentFeedbackScheme, entry, entryLoaded, form, refs, routeLeave, submit };
  },
});
</script>

<style lang="scss" scoped></style>
