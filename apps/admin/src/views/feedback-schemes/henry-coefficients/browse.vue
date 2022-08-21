<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <preview :feedback-scheme="currentFeedbackScheme"></preview>
    </template>
    <henry-coefficient-list
      v-model="form.henryCoefficients"
      :scheme-id="id"
    ></henry-coefficient-list>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { HenryCoefficientList, Preview } from '@intake24/admin/components/feedback';
import { form } from '@intake24/admin/helpers';

import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeHenryCoefficientsForm = Pick<FeedbackSchemeForm, 'henryCoefficients'>;

export default defineComponent({
  name: 'FeedbackSchemeHenryCoefficients',

  components: { HenryCoefficientList, Preview },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<FeedbackSchemeEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<FeedbackSchemeHenryCoefficientsForm>({ henryCoefficients: [] }),
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
