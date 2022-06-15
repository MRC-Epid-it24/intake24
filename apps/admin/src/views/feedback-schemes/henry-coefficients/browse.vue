<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <preview :feedbackScheme="currentFeedbackScheme"></preview>
    </template>
    <henry-coefficient-list
      v-model="form.henryCoefficients"
      :scheme-id="id"
    ></henry-coefficient-list>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import type { FormMixin } from '@intake24/admin/types';
import { HenryCoefficientList, Preview } from '@intake24/admin/components/feedback';
import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeHenryCoefficientsForm = Pick<FeedbackSchemeForm, 'henryCoefficients'>;

export default (Vue as VueConstructor<Vue & FormMixin<FeedbackSchemeEntry>>).extend({
  name: 'FeedbackSchemeHenryCoefficients',

  components: { HenryCoefficientList, Preview },

  mixins: [formMixin],

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
