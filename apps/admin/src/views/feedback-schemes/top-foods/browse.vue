<template>
  <layout
    v-if="entryLoaded && refsLoaded"
    v-bind="{ id, entry }"
    v-model:route-leave="routeLeave"
    @save="submit"
  >
    <template #actions>
      <preview :feedback-scheme="currentFeedbackScheme" :images="refs?.images" />
    </template>
    <v-toolbar color="grey-lighten-4" flat tile>
      <v-icon color="secondary" end>
        fas fa-sort-amount-down
      </v-icon>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('feedback-schemes.top-foods.title') }}
      </v-toolbar-title>
      <v-spacer />
      <options-menu>
        <select-resource resource="feedback-schemes" return-object="topFoods" @update:model-value="load">
          <template #activator="{ props }">
            <v-list-item v-bind="props" link>
              <template #prepend>
                <v-icon icon="$download" />
              </template>
              <v-list-item-title>
                {{ $t('feedback-schemes.load') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </select-resource>
        <json-editor-dialog v-model="form.topFoods" />
      </options-menu>
    </v-toolbar>
    <v-form @keydown="clearError" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-toolbar color="grey-lighten-2" flat tile>
              <v-icon color="secondary" end>
                fas fa-palette
              </v-icon>
              <v-toolbar-title class="font-weight-medium">
                {{ $t('feedback-schemes.top-foods.max.title') }}
              </v-toolbar-title>
              <v-spacer />
              <v-text-field
                v-model.number="form.topFoods.max"
                bg-color="grey lighten-5"
                density="compact"
                :error-messages="form.errors.get('topFoods.max')"
                hide-details
                :label="$t('feedback-schemes.top-foods.max._')"
                name="topFoods.max"
                :rules="topFoodsMaxRules"
                single-line
                :style="{ maxWidth: '75px' }"
                variant="outlined"
              />
            </v-toolbar>
            <error-list :errors="nonInputErrors" />
            <color-list
              v-model="form.topFoods.colors"
              :last-label="$t('feedback-schemes.top-foods.other')"
            />
          </v-col>
          <v-divider vertical />
          <v-col cols="12" md="6">
            <nutrient-list
              v-model="form.topFoods.nutrientTypes"
              :defaults="defaultTopFoods.nutrientTypes"
              :nutrient-types="refs.nutrientTypes"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <submit-footer :disabled="form.errors.any()" />
      </v-card-text>
    </v-form>
  </layout>
</template>

<script lang="ts">
import debounce from 'lodash/debounce';
import { computed, defineComponent, ref, watch } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { TopFoods } from '@intake24/common/feedback';
import type { FeedbackSchemeEntry, FeedbackSchemeRefs } from '@intake24/common/types/http/admin';
import { OptionsMenu, SelectResource } from '@intake24/admin/components/dialogs';
import { JsonEditorDialog } from '@intake24/admin/components/editors';
import { formMixin } from '@intake24/admin/components/entry';
import { Preview } from '@intake24/admin/components/feedback';
import { ColorList, NutrientList } from '@intake24/admin/components/lists';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { defaultTopFoods } from '@intake24/common/feedback';
import { colors } from '@intake24/common/theme';
import { useI18n } from '@intake24/i18n';

import type { FeedbackSchemeForm } from '../form.vue';

export type FeedbackSchemeTopFoodsForm = Pick<FeedbackSchemeForm, 'topFoods'>;

export default defineComponent({
  name: 'FeedbackSchemeTopFoods',

  components: {
    ColorList,
    JsonEditorDialog,
    NutrientList,
    OptionsMenu,
    Preview,
    SelectResource,
  },

  mixins: [formMixin],

  setup(props) {
    const menu = ref(false);

    const { i18n } = useI18n();

    const { entry, entryLoaded, refs, refsLoaded } = useEntry<
      FeedbackSchemeEntry,
      FeedbackSchemeRefs
    >(props);
    useEntryFetch(props);
    const { clearError, form, nonInputErrors, routeLeave, submit } = useEntryForm<
      FeedbackSchemeTopFoodsForm,
      FeedbackSchemeEntry
    >(props, {
      data: { topFoods: defaultTopFoods },
      editMethod: 'patch',
      nonInputErrorKeys: ['topFoods.max', 'topFoods.colors', 'topFoods.nutrientTypes'],
    });

    const topFoodsMaxRules = computed<RuleCallback[]>(() => [
      (value: string | null): boolean | string =>
        Number.isInteger(value) || i18n.t('feedback-schemes.colors.max.required'),
    ]);

    const currentFeedbackScheme = computed(() => ({ ...entry.value, ...form.getData() }));

    const updateColorList = () => {
      const size = form.topFoods.max + 1;

      if (size < form.topFoods.colors.length) {
        form.topFoods.colors = [...form.topFoods.colors.slice(0, size)];
      }
      else if (size > form.topFoods.colors.length) {
        const newColors = Array.from<string>({
          length: size - form.topFoods.colors.length,
        }).fill(colors.primary);

        form.topFoods.colors = [...form.topFoods.colors, ...newColors];
      }
    };

    const load = (topFoods: TopFoods) => {
      form.topFoods = { ...topFoods };
    };

    const debouncedUpdateColorList = debounce(() => {
      updateColorList();
    }, 300);

    watch(
      () => form.topFoods.max,
      () => {
        debouncedUpdateColorList();
      },
    );

    return {
      defaultTopFoods,
      entry,
      entryLoaded,
      refs,
      refsLoaded,
      clearError,
      form,
      menu,
      nonInputErrors,
      routeLeave,
      submit,
      topFoodsMaxRules,
      currentFeedbackScheme,
      load,
    };
  },
});
</script>

<style lang="scss" scoped></style>
