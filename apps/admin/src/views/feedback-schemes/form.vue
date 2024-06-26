<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <template #actions>
      <copy-scheme-dialog
        v-if="canHandleEntry('copy')"
        resource="feedback-schemes"
        :scheme-id="id"
      />
      <preview v-if="!isCreate" :feedback-scheme="currentFeedbackScheme" />
    </template>
    <v-form @keydown.native="clearError" @submit.prevent="submit">
      <v-container fluid>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                class="mb-4"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('common.name')"
                name="name"
                outlined
              />
              <v-select
                v-model="form.type"
                class="mb-4"
                :error-messages="form.errors.get('type')"
                hide-details="auto"
                :items="types"
                :label="$t('feedback-schemes.types._')"
                name="type"
                outlined
                @change="form.errors.clear('type')"
              />
              <v-select
                v-model="form.outputs"
                class="mb-4"
                :error-messages="form.errors.get('outputs')"
                hide-details="auto"
                :items="outputs"
                :label="$t('feedback-schemes.outputs.title')"
                multiple
                name="outputs"
                outlined
                prepend-inner-icon="fas fa-right-from-bracket"
                @change="form.errors.clear('outputs')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.outputs.length === 1">{{ item.text }}</span>
                    <span v-if="form.outputs.length > 1">
                      {{ $t('common.selected', { count: form.outputs.length }) }}
                    </span>
                  </template>
                </template>
              </v-select>
              <v-select
                v-model="form.physicalDataFields"
                class="mb-2"
                :error-messages="form.errors.get('physicalDataFields')"
                hide-details="auto"
                :items="physicalDataFields"
                :label="$t('feedback-schemes.physicalDataFields.title')"
                multiple
                name="physicalDataFields"
                outlined
                prepend-inner-icon="fas fa-person-circle-question"
                @change="form.errors.clear('physicalDataFields')"
              >
                <template #selection="{ item, index }">
                  <template v-if="index === 0">
                    <span v-if="form.physicalDataFields.length === 1">{{ item.text }}</span>
                    <span v-if="form.physicalDataFields.length > 1">
                      {{ $t('common.selected', { count: form.physicalDataFields.length }) }}
                    </span>
                  </template>
                </template>
              </v-select>
              <template v-for="(value, key) in requiredPhysicalDataFields">
                <v-alert
                  v-if="!value && form.physicalDataFields.includes(key)"
                  :key="key"
                  class="text-caption"
                  dense
                  text
                  type="info"
                >
                  <i18n path="feedback-schemes.physicalDataFields.notRequired">
                    <template #field>
                      <span class="font-weight-medium">
                        "{{ $t(`feedback-schemes.physicalDataFields.${key}`) }}"
                      </span>
                    </template>
                  </i18n>
                </v-alert>
                <v-alert
                  v-if="value && !form.physicalDataFields.includes(key)"
                  :key="key"
                  class="text-caption"
                  dense
                  text
                  type="warning"
                >
                  <i18n path="feedback-schemes.physicalDataFields.required">
                    <template #field>
                      <span class="font-weight-medium">
                        "{{ $t(`feedback-schemes.physicalDataFields.${key}`) }}"
                      </span>
                    </template>
                  </i18n>
                </v-alert>
              </template>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.visibility"
                class="mb-4"
                :error-messages="form.errors.get('visibility')"
                hide-details="auto"
                :items="visibilityList"
                :label="$t('securables.visibility._')"
                name="visibility"
                outlined
                @change="form.errors.clear('visibility')"
              >
                <template #item="{ item }">
                  <v-icon left>
                    {{ item.icon }}
                  </v-icon>
                  {{ item.text }}
                </template>
                <template #selection="{ item }">
                  <v-icon left>
                    {{ item.icon }}
                  </v-icon>
                  {{ item.text }}
                </template>
              </v-select>
              <v-card outlined>
                <v-toolbar color="grey lighten-3" dense flat tile>
                  <v-icon color="secondary" left>
                    fas fa-bars-staggered
                  </v-icon>
                  <v-toolbar-title class="font-weight-medium">
                    {{ $t('feedback-schemes.sections.title') }}
                  </v-toolbar-title>
                  <v-spacer />
                </v-toolbar>
                <v-list class="py-0">
                  <draggable
                    v-model="sections"
                    handle=".drag-and-drop__handle"
                    @end="updateSectionOrder"
                  >
                    <transition-group name="drag-and-drop" type="transition">
                      <v-list-item
                        v-for="section in sections"
                        :key="section.value"
                        class="drag-and-drop__item"
                        draggable
                        link
                      >
                        <v-list-item-avatar class="drag-and-drop__handle">
                          <v-icon>fas fa-grip-vertical</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ section.text }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox
                            v-model="form.sections"
                            color="secondary"
                            :value="section.value"
                          />
                        </v-list-item-action>
                      </v-list-item>
                    </transition-group>
                  </draggable>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()" />
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

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
import type { FeedbackSchemeEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { Preview } from '@intake24/admin/components/feedback';
import { CopySchemeDialog } from '@intake24/admin/components/schemes';
import { useEntry, useEntryFetch, useEntryForm, useSelects } from '@intake24/admin/composables';
import {
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackSections,
  feedbackTypes,
} from '@intake24/common/feedback';
import { kebabCase } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

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

  components: { CopySchemeDialog, Draggable: draggable, Preview },

  mixins: [formMixin],

  setup(props) {
    const { i18n } = useI18n();
    const { visibilityList } = useSelects();

    const types = feedbackTypes.map(value => ({
      value,
      text: i18n.t(`feedback-schemes.types.${value}`),
    }));

    const outputs = feedbackOutputs.map(value => ({
      value,
      text: i18n.t(`feedback-schemes.outputs.${value}`),
    }));

    const sections = ref(
      feedbackSections.map(value => ({
        value,
        text: i18n.t(`feedback-schemes.${kebabCase(value)}.title`),
      })),
    );

    const { canHandleEntry, entry, entryLoaded, isCreate } = useEntry<FeedbackSchemeEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      PatchFeedbackSchemeForm,
      FeedbackSchemeEntry
    >(props, {
      data: {
        name: null,
        type: 'default',
        outputs: [...feedbackOutputs],
        sections: [...feedbackSections],
        physicalDataFields: [...feedbackPhysicalDataFields],
        visibility: 'public',
      },
      editMethod: 'patch',
      loadCallback: (entry: FeedbackSchemeEntry) => {
        sections.value.sort((a, b) => {
          const aIdx = entry.sections.indexOf(a.value);
          const bIdx = entry.sections.indexOf(b.value);

          if (aIdx === -1)
            return 1;
          if (bIdx === -1)
            return -1;

          return aIdx - bIdx;
        });
        return entry;
      },
    });

    const updateSectionOrder = () => {
      form.sections = sections.value
        .filter(section => form.sections.includes(section.value))
        .map(section => section.value);
    };

    const physicalDataFields = feedbackPhysicalDataFields.map(value => ({
      value,
      text: i18n.t(`feedback-schemes.physicalDataFields.${value}`),
    }));

    const currentFeedbackScheme = computed<FeedbackSchemeEntry>(
      () =>
        ({
          ...entry.value,
          ...form.getData(true),
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
      updateSectionOrder,
      sections,
      types,
      outputs,
      physicalDataFields,
      isCreate,
      clearError,
      form,
      routeLeave,
      submit,
      requiredPhysicalDataFields,
      visibilityList,
    };
  },
});
</script>

<style lang="scss" scoped></style>
