<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <template v-slot:actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        :schemeId="id"
        resource="feedback-schemes"
      ></copy-scheme-dialog>
      <preview v-if="!isCreate" :feedbackScheme="currentFeedbackScheme"></preview>
    </template>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                :label="$t('common.name')"
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :items="feedbackTypes"
                :error-messages="form.errors.get('type')"
                :label="$t('feedback-schemes.types._')"
                hide-details="auto"
                name="type"
                outlined
                @change="form.errors.clear('type')"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()"></submit-footer>
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import { form } from '@intake24/admin/helpers';
import { FormMixin } from '@intake24/admin/types';
import {
  FeedbackType,
  feedbackTypes,
  Card,
  TopFoods,
  DemographicGroup,
  HenryCoefficient,
} from '@intake24/common/feedback';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { Preview } from '@intake24/admin/components/feedback';
import { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';

export type FeedbackSchemeForm = {
  id: string | null;
  name: string | null;
  type: FeedbackType;
  topFoods: TopFoods;
  cards: Card[];
  demographicGroups: DemographicGroup[];
  henryCoefficients: HenryCoefficient[];
};

export type PatchFeedbackSchemeForm = Pick<FeedbackSchemeForm, 'name' | 'type'>;

export default (Vue as VueConstructor<Vue & FormMixin<FeedbackSchemeEntry>>).extend({
  name: 'SchemeForm',

  components: { CopySchemeDialog, Preview },

  mixins: [formMixin],

  data() {
    return {
      editMethod: 'patch',
      form: form<PatchFeedbackSchemeForm>({
        name: null,
        type: 'default',
      }),
      feedbackTypes: feedbackTypes.map((value) => ({
        value,
        text: this.$t(`feedback-schemes.types.${value}`),
      })),
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
