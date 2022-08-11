<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="ml-3"
          color="secondary"
          fab
          small
          :title="$t(`${schemeType}-schemes.load`)"
        >
          <v-icon>fa-download</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card :loading="loading">
      <v-toolbar color="primary" dark flat>
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t(`${schemeType}-schemes.load`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-text-field
          v-model="search"
          :label="$t('common.search._')"
          :loading="loading"
          append-icon="fas fa-search"
          class="mb-4"
          clearable
          hide-details="auto"
          outlined
          @click:clear="clear"
        >
        </v-text-field>
        <template v-if="items.length">
          <v-list min-height="350px" dense>
            <v-list-item-group v-model="selected">
              <template v-for="(item, idx) in items">
                <v-list-item :key="item.id" :value="item.id">
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-avatar>
                      <v-icon>fa-route</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider v-if="idx + 1 < items.length" :key="`div-${item.id}`"></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
          <div class="text-center">
            <v-pagination v-model="page" :length="lastPage" circle></v-pagination>
          </div>
        </template>
        <v-alert v-else color="primary" text type="info">
          {{ $t(`${schemeType}-schemes.none`) }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
          <v-icon left>$cancel</v-icon> {{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold"
          color="blue darken-3"
          :disabled="!selected"
          text
          @click.stop="confirm"
        >
          <v-icon left>$success</v-icon> {{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { FeedbackSchemeEntry, SurveySchemeEntry } from '@intake24/common/types/http/admin';
import { copy } from '@intake24/common/util';

import { useFetchList } from '../lists';

export type SchemeEntry = FeedbackSchemeEntry | SurveySchemeEntry;

const feedbackSchemeSections = [
  'topFoods',
  'cards',
  'demographicGroups',
  'henryCoefficients',
] as const;

export type FeedbackSchemeSection = typeof feedbackSchemeSections[number];

export const isFeedbackSchemeEntry = (entry: any): entry is FeedbackSchemeEntry => {
  const entryKeys = Object.keys(entry);
  return feedbackSchemeSections.every((section) => entryKeys.includes(section));
};

export const isFeedbackSchemeSection = (section: any): section is FeedbackSchemeSection =>
  feedbackSchemeSections.includes(section);

const surveySchemeSections = ['dataExport', 'meals', 'questions'] as const;

export type SurveySchemeSection = typeof surveySchemeSections[number];

export const isSurveySchemeEntry = (entry: any): entry is SurveySchemeEntry => {
  const entryKeys = Object.keys(entry);
  return surveySchemeSections.every((section) => entryKeys.includes(section));
};

export const isSurveySchemeSection = (section: any): section is SurveySchemeSection =>
  surveySchemeSections.includes(section);

export default defineComponent({
  name: 'LoadSectionDialog',

  props: {
    schemeType: {
      type: String as PropType<'feedback' | 'survey'>,
      required: true,
    },
    schemeId: {
      type: String,
      required: true,
    },
    section: {
      type: String as PropType<FeedbackSchemeSection | SurveySchemeSection>,
      required: true,
    },
  },

  setup(props) {
    const selected = ref<string | undefined>();

    const { dialog, loading, page, lastPage, search, items, fetch, clear } =
      useFetchList<SchemeEntry>(`admin/${props.schemeType}-schemes`);

    return {
      dialog,
      loading,
      items,
      page,
      lastPage,
      search,
      selected,
      fetch,
      clear,
      feedbackSchemeSections,
      surveySchemeSections,
    };
  },

  computed: {
    selectedSection(): any | undefined {
      const { section, selected } = this;
      if (!selected) return undefined;

      const item = this.items.find((item) => item.id === selected);
      if (!item) return undefined;

      if (isFeedbackSchemeEntry(item) && isFeedbackSchemeSection(section)) return item[section];

      if (isSurveySchemeEntry(item) && isSurveySchemeSection(section)) return item[section];

      return undefined;
    },
  },

  methods: {
    close() {
      this.selected = undefined;
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    confirm() {
      if (!this.selectedSection) return;

      this.$emit('load', copy(this.selectedSection));
      this.close();
    },
  },
});
</script>
