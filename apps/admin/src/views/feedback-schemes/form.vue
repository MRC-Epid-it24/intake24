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
            <v-col cols="12" md="6">
              <v-select
                v-model="form.outputs"
                :items="feedbackOutputs"
                :error-messages="form.errors.get('outputs')"
                :label="$t('feedback-schemes.outputs.title')"
                hide-details="auto"
                multiple
                name="outputs"
                outlined
                @change="form.errors.clear('outputs')"
              >
                <template v-slot:selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.outputs.length === 1">{{ item.text }}</span>
                    <span v-if="form.outputs.length > 1">
                      {{ $t('common.selected', { count: form.outputs.length }) }}
                    </span>
                  </template>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.physicalDataFields"
                :items="feedbackPhysicalDataFields"
                :error-messages="form.errors.get('physicalDataFields')"
                :label="$t('feedback-schemes.physicalDataFields.title')"
                hide-details="auto"
                multiple
                name="physicalDataFields"
                outlined
                @change="form.errors.clear('physicalDataFields')"
              >
                <template v-slot:selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.physicalDataFields.length === 1">{{ item.text }}</span>
                    <span v-if="form.physicalDataFields.length > 1">
                      {{ $t('common.selected', { count: form.physicalDataFields.length }) }}
                    </span>
                  </template>
                </template>
              </v-select>
            </v-col>
            <v-col>
              <template v-for="(value, key) in requiredPhysicalDataFields">
                <v-alert
                  v-if="!value && form.physicalDataFields.includes(key)"
                  :key="key"
                  text
                  type="info"
                >
                  <i18n path="feedback-schemes.physicalDataFields.notRequired" tag="div">
                    <template v-slot:field>
                      <span class="font-weight-medium">
                        "{{ $t(`feedback-schemes.physicalDataFields.${key}`) }}"
                      </span>
                    </template>
                  </i18n>
                </v-alert>
                <v-alert
                  v-if="value && !form.physicalDataFields.includes(key)"
                  :key="key"
                  text
                  type="warning"
                >
                  <i18n path="feedback-schemes.physicalDataFields.required" tag="div">
                    <template v-slot:field>
                      <span class="font-weight-medium">
                        "{{ $t(`feedback-schemes.physicalDataFields.${key}`) }}"
                      </span>
                    </template>
                  </i18n>
                </v-alert>
              </template>
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
import { defineComponent } from 'vue';

import type {
  Card,
  DemographicGroup,
  FeedbackOutput,
  FeedbackPhysicalDataField,
  FeedbackType,
  HenryCoefficient,
  TopFoods,
} from '@intake24/common/feedback';
import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { Preview } from '@intake24/admin/components/feedback';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { form } from '@intake24/admin/helpers';
import {
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackTypes,
} from '@intake24/common/feedback';

export type FeedbackSchemeForm = {
  id: string | null;
  name: string | null;
  type: FeedbackType;
  outputs: FeedbackOutput[];
  physicalDataFields: FeedbackPhysicalDataField[];
  topFoods: TopFoods;
  cards: Card[];
  demographicGroups: DemographicGroup[];
  henryCoefficients: HenryCoefficient[];
};

export type PatchFeedbackSchemeForm = Pick<
  FeedbackSchemeForm,
  'name' | 'type' | 'outputs' | 'physicalDataFields'
>;

export default defineComponent({
  name: 'SchemeForm',

  components: { CopySchemeDialog, Preview },

  mixins: [formMixin],

  setup(props) {
    const { canHandleEntry, entry, entryLoaded } = useStoreEntry<FeedbackSchemeEntry>(props.id);

    return { canHandleEntry, entry, entryLoaded };
  },

  data() {
    return {
      editMethod: 'patch',
      form: form<PatchFeedbackSchemeForm>({
        name: null,
        type: 'default',
        outputs: [...feedbackOutputs],
        physicalDataFields: [...feedbackPhysicalDataFields],
      }),
      feedbackTypes: feedbackTypes.map((value) => ({
        value,
        text: this.$t(`feedback-schemes.types.${value}`),
      })),
      feedbackOutputs: feedbackOutputs.map((value) => ({
        value,
        text: this.$t(`feedback-schemes.outputs.${value}`),
      })),
      feedbackPhysicalDataFields: feedbackPhysicalDataFields.map((value) => ({
        value,
        text: this.$t(`feedback-schemes.physicalDataFields.${value}`),
      })),
    };
  },

  computed: {
    currentFeedbackScheme(): FeedbackSchemeEntry {
      return { ...this.entry, ...this.form.getData(true) } as FeedbackSchemeEntry;
    },
    requiredPhysicalDataFields(): any {
      const flags: Record<FeedbackPhysicalDataField, boolean> = {
        sex: false,
        weightKg: false,
        heightCm: false,
        physicalActivityLevelId: false,
        birthdate: false,
        weightTarget: false,
      };

      return this.entry.demographicGroups.reduce((acc, group) => {
        if (group.nutrientRuleType === 'energy_divided_by_bmr') {
          Object.keys(acc).forEach((key) => {
            acc[key as FeedbackPhysicalDataField] = true;
          });
          return acc;
        }

        if (group.age) acc.birthdate = true;
        if (group.sex) acc.sex = true;
        if (group.weight) acc.weightKg = true;
        if (group.height) acc.heightCm = true;
        if (group.physicalActivityLevelId) acc.physicalActivityLevelId = true;
        if (group.nutrientRuleType === 'per_unit_of_weight') acc.weightKg = true;

        return acc;
      }, flags);
    },
  },
});
</script>

<style lang="scss" scoped></style>
