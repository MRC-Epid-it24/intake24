<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-card-title>{{ $t('survey-schemes.overrides.title') }}</v-card-title>
    <v-card-subtitle>
      {{ $t('survey-schemes.overrides.subtitle') }}
    </v-card-subtitle>
    <v-tabs v-model="tab" class="mt-4" grow>
      <v-tab v-for="item in ['settings', 'prompts', 'meals']" :key="item" :tab-value="item">
        {{ $t(`survey-schemes.${item}.title`) }}
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item key="settings" value="settings">
        <v-card>
          <v-card-title>{{ $t('survey-schemes.overrides.settings.title') }}</v-card-title>
          <v-card-text>
            <v-row>
              <override-field v-model="switches.type" @change="toggle('type', $event)">
                <v-select
                  v-model="form.surveySchemeOverrides.settings.type"
                  :disabled="!switches.type"
                  :error-messages="form.errors.get('settings.type')"
                  hide-details="auto"
                  :items="schemeTypes"
                  :label="$t('survey-schemes.settings.types._')"
                  name="settings.type"
                  variant="outlined"
                  @update:model-value="form.errors.clear('settings.type')"
                />
              </override-field>
              <override-field v-model="switches.flow" @change="toggle('flow', $event)">
                <v-select
                  v-model="form.surveySchemeOverrides.settings.flow"
                  :disabled="!switches.flow"
                  :error-messages="form.errors.get('settings.flow')"
                  hide-details="auto"
                  :items="recallFlows"
                  :label="$t('survey-schemes.settings.flows._')"
                  name="settings.flow"
                  variant="outlined"
                  @update:model-value="form.errors.clear('settings.flow')"
                />
              </override-field>
              <override-field v-model="switches.recallDate" @change="toggle('recallDate', $event)">
                <v-text-field
                  v-model="form.surveySchemeOverrides.settings.recallDate"
                  :disabled="!switches.recallDate"
                  hide-details="auto"
                  :label="$t('survey-schemes.settings.recallDate')"
                  name="settings.recallDate"
                  variant="outlined"
                />
              </override-field>
              <override-field v-model="switches.languages" @change="toggle('languages', $event)">
                <v-select
                  v-model="form.surveySchemeOverrides.settings.languages"
                  :disabled="!switches.languages"
                  :error-messages="form.errors.get('settings.languages')"
                  hide-details="auto"
                  item-title="englishName"
                  item-value="code"
                  :items="languages"
                  :label="$t('survey-schemes.settings.languages')"
                  multiple
                  name="settings.languages"
                  variant="outlined"
                  @update:model-value="form.errors.clear('settings.languages')"
                />
              </override-field>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
      <v-tabs-window-item key="prompts" value="prompts">
        <v-expansion-panels v-model="panels" flat>
          <prompt-list
            v-bind="{ mode: 'override', promptIds, templates: prompts }"
            v-model="form.surveySchemeOverrides.prompts"
          />
        </v-expansion-panels>
      </v-tabs-window-item>
      <v-tabs-window-item key="meals" value="meals">
        <meal-list
          v-model="form.surveySchemeOverrides.meals"
          mode="override"
          :scheme-id="entry.surveySchemeId"
        />
      </v-tabs-window-item>
    </v-tabs-window>
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-text>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import type { SchemeOverrides, SchemeSettings } from '@intake24/common/surveys';
import type { SurveyEntry } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { MealList } from '@intake24/admin/components/lists';
import PromptList from '@intake24/admin/components/prompts/list/prompt-list.vue';
import { useEntry, useEntryFetch, useEntryForm, useSelects } from '@intake24/admin/composables';
import { defaultOverrides, defaultSchemeSettings, flattenScheme } from '@intake24/common/surveys';
import { useApp } from '@intake24/ui/stores';

import OverrideField from './override-field.vue';

export type SurveyOverridesForm = { surveySchemeOverrides: SchemeOverrides };

export default defineComponent({
  name: 'SurveySchemeOverrides',

  components: { MealList, OverrideField, PromptList },

  mixins: [formMixin],

  setup(props) {
    const { recallFlows, schemeTypes } = useSelects();
    const { entry, entryLoaded } = useEntry<SurveyEntry>(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<SurveyOverridesForm, SurveyEntry>(
      props,
      { data: { surveySchemeOverrides: defaultOverrides }, editMethod: 'patch' },
    );

    const languages = computed(() => useApp().langs);

    const switches = computed(() => ({
      type: 'type' in form.surveySchemeOverrides.settings,
      flow: 'flow' in form.surveySchemeOverrides.settings,
      recallDate: 'recallDate' in form.surveySchemeOverrides.settings,
      languages: 'languages' in form.surveySchemeOverrides.settings,
    }));
    const tab = ref('settings');

    const toggle = (key: keyof SchemeSettings, value: boolean) => {
      if (value) {
        form.surveySchemeOverrides.settings = { ...form.surveySchemeOverrides.settings, [key]: defaultSchemeSettings[key] };
        return;
      }

      const { [key]: _, ...rest } = form.surveySchemeOverrides.settings;

      form.surveySchemeOverrides.settings = rest;
    };

    const panels = ref(['override']);
    const promptIds = computed(() => form.surveySchemeOverrides.prompts.map(({ id }) => id));
    const prompts = computed(() => entryLoaded.value ? flattenScheme(entry.value.surveyScheme.prompts) : []);

    return {
      entry,
      entryLoaded,
      clearError,
      form,
      languages,
      panels,
      prompts,
      promptIds,
      recallFlows,
      routeLeave,
      schemeTypes,
      submit,
      switches,
      tab,
      toggle,
    };
  },
});
</script>

<style lang="scss" scoped></style>
