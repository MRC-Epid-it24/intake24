<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <template #actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        resource="feedback-schemes"
        :scheme-id="id"
      />
      <preview v-if="!isCreate" :feedback-scheme="currentFeedbackScheme" :images="refs?.images" />
    </template>
    <v-form @keydown="clearError" @submit.prevent="submit">
      <v-container fluid>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :error-messages="form.errors.get('type')"
                hide-details="auto"
                :items="types"
                :label="$t('feedback-schemes.types._')"
                name="type"
                variant="outlined"
                @update:model-value="form.errors.clear('type')"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.outputs"
                :error-messages="form.errors.get('outputs')"
                hide-details="auto"
                :items="outputs"
                :label="$t('feedback-schemes.outputs.title')"
                multiple
                name="outputs"
                prepend-inner-icon="fas fa-right-from-bracket"
                variant="outlined"
                @update:model-value="form.errors.clear('outputs')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.outputs.length === 1">{{ item.raw.title }}</span>
                    <span v-if="form.outputs.length > 1">
                      {{ $t('common.selected', { count: form.outputs.length }) }}
                    </span>
                  </template>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.visibility"
                :error-messages="form.errors.get('visibility')"
                hide-details="auto"
                :items="visibilities"
                :label="$t('securables.visibility._')"
                name="visibility"
                variant="outlined"
                @update:model-value="form.errors.clear('visibility')"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :icon="item.raw.icon" start />
                    </template>
                    <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <v-icon :icon="item.raw.icon" start />
                  {{ item.raw.title }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.physicalDataFields"
                class="mb-2"
                :error-messages="form.errors.get('physicalDataFields')"
                hide-details="auto"
                :items="physicalDataFields"
                :label="$t('feedback-schemes.physicalDataFields.title')"
                multiple
                name="physicalDataFields"
                prepend-inner-icon="fas fa-person-circle-question"
                variant="outlined"
                @update:model-value="form.errors.clear('physicalDataFields')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.physicalDataFields.length === 1">{{ item.raw.title }}</span>
                    <span v-if="form.physicalDataFields.length > 1">
                      {{ $t('common.selected', { count: form.physicalDataFields.length }) }}
                    </span>
                  </template>
                </template>
              </v-select>
              <template v-for="(value, key) in requiredPhysicalDataFields" :key="key">
                <v-alert
                  v-if="!value && form.physicalDataFields.includes(key)"
                  class="text-caption mb-1"
                  density="compact"
                  type="info"
                >
                  <i18n-t keypath="feedback-schemes.physicalDataFields.notRequired">
                    <template #field>
                      <span class="font-weight-medium">
                        "{{ $t(`feedback-schemes.physicalDataFields.${key}`) }}"
                      </span>
                    </template>
                  </i18n-t>
                </v-alert>
                <v-alert
                  v-if="value && !form.physicalDataFields.includes(key)"
                  :key="key"
                  class="text-caption mb-1"
                  density="compact"
                  type="warning"
                >
                  <i18n-t keypath="feedback-schemes.physicalDataFields.required">
                    <template #field>
                      <span class="font-weight-medium">
                        "{{ $t(`feedback-schemes.physicalDataFields.${key}`) }}"
                      </span>
                    </template>
                  </i18n-t>
                </v-alert>
              </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <feedback-sections v-model="form.sections" />
      <v-card-text>
        <submit-footer :disabled="form.errors.any()" />
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import type {
  Card,
  DemographicGroup,
  FeedbackMeals,
  FeedbackOutput,
  FeedbackPhysicalDataField,
  FeedbackSection,
  FeedbackType,
  HenryCoefficient,
  TopFoods,
} from '@intake24/common/feedback';
import type { RecordVisibility } from '@intake24/common/security';
import type { FeedbackSchemeEntry, FeedbackSchemeRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { Preview } from '@intake24/admin/components/feedback';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { useEntry, useEntryFetch, useEntryForm, useSelects } from '@intake24/admin/composables';
import {
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackTypes,
} from '@intake24/common/feedback';
import { useI18n } from '@intake24/i18n';

import FeedbackSections from './sections.vue';

export type FeedbackSchemeForm = {
  id: string | null;
  name: string | null;
  type: FeedbackType;
  outputs: FeedbackOutput[];
  sections: FeedbackSection[];
  physicalDataFields: FeedbackPhysicalDataField[];
  topFoods: TopFoods;
  meals: FeedbackMeals;
  cards: Card[];
  demographicGroups: DemographicGroup[];
  henryCoefficients: HenryCoefficient[];
  visibility: RecordVisibility;
};

export type PatchFeedbackSchemeForm = Pick<
  FeedbackSchemeForm,
  'name' | 'type' | 'outputs' | 'physicalDataFields' | 'sections' | 'visibility'
>;

export default defineComponent({
  name: 'SchemeForm',

  components: { CopySchemeDialog, FeedbackSections, Preview },

  mixins: [formMixin],

  setup(props) {
    const { i18n } = useI18n();
    const { visibilities } = useSelects();

    const types = feedbackTypes.map(value => ({
      value,
      title: i18n.t(`feedback-schemes.types.${value}`),
    }));

    const outputs = feedbackOutputs.map(value => ({
      value,
      title: i18n.t(`feedback-schemes.outputs.${value}`),
    }));

    const { canHandleEntry, entry, entryLoaded, isCreate, refs } = useEntry<FeedbackSchemeEntry, FeedbackSchemeRefs>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      PatchFeedbackSchemeForm,
      FeedbackSchemeEntry
    >(props, {
      data: {
        name: null,
        type: 'default',
        outputs: [],
        sections: [],
        physicalDataFields: [...feedbackPhysicalDataFields],
        visibility: 'public',
      },
      editMethod: 'patch',
    });

    const physicalDataFields = feedbackPhysicalDataFields.map(value => ({
      value,
      title: i18n.t(`feedback-schemes.physicalDataFields.${value}`),
    }));

    const currentFeedbackScheme = computed<FeedbackSchemeEntry>(
      () =>
        ({
          ...entry.value,
          ...form.getData(),
        }) as FeedbackSchemeEntry,
    );

    const requiredPhysicalDataFields = computed<Record<FeedbackPhysicalDataField, boolean>>(() => {
      const flags: Record<FeedbackPhysicalDataField, boolean> = {
        sex: false,
        weightKg: false,
        heightCm: false,
        physicalActivityLevelId: false,
        birthdate: false,
        weightTarget: false,
      };

      return (
        entry.value.demographicGroups?.reduce((acc, group) => {
          if (group.nutrientRuleType === 'energy_divided_by_bmr') {
            Object.keys(acc).forEach((key) => {
              acc[key as FeedbackPhysicalDataField] = true;
            });
            return acc;
          }

          if (group.age)
            acc.birthdate = true;
          if (group.sex)
            acc.sex = true;
          if (group.weight)
            acc.weightKg = true;
          if (group.height)
            acc.heightCm = true;
          if (group.physicalActivityLevelId)
            acc.physicalActivityLevelId = true;
          if (group.nutrientRuleType === 'per_unit_of_weight')
            acc.weightKg = true;

          return acc;
        }, flags) ?? flags
      );
    });

    return {
      canHandleEntry,
      currentFeedbackScheme,
      entry,
      entryLoaded,
      types,
      outputs,
      physicalDataFields,
      isCreate,
      clearError,
      form,
      refs,
      routeLeave,
      submit,
      requiredPhysicalDataFields,
      visibilities,
    };
  },
});
</script>

<style lang="scss" scoped></style>
