<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <preview :feedbackScheme="currentFeedbackScheme"></preview>
    </template>
    <card-list v-model="form.cards" :scheme-id="id"></card-list>
  </layout>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import type { FormMixin } from '@intake24/admin/types';
import { CardList, Preview } from '@intake24/admin/components/feedback';
import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeFoodGroupsForm = Pick<FeedbackSchemeForm, 'cards'>;

export default (Vue as VueConstructor<Vue & FormMixin<FeedbackSchemeEntry>>).extend({
  name: 'FeedbackSchemeFoodGroups',

  components: { CardList, Preview },

  mixins: [formMixin],

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
