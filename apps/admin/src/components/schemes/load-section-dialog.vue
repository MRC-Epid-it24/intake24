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
          @click:append="fetch"
          @click:clear="clear"
          @keyup.enter="fetch"
        >
        </v-text-field>
        <v-list v-if="schemes.length" min-height="350px">
          <v-list-item-group v-model="selectedId">
            <template v-for="(scheme, idx) in schemes">
              <v-list-item :key="scheme.id" :value="scheme.id">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-avatar>
                    <v-icon>fa-route</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ scheme.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
              <v-divider v-if="idx + 1 < schemes.length" :key="`div-${scheme.id}`"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
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
          :disabled="!selectedId"
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
import Vue, { PropType, VueConstructor } from 'vue';
import { copy } from '@intake24/common/util';
import debounce from 'lodash/debounce';
import type {
  FeedbackSchemeEntry,
  FeedbackSchemesResponse,
  SurveySchemeEntry,
  SurveySchemesResponse,
} from '@intake24/common/types/http/admin';

type LoadSectionDialog = {
  debouncedFetch: () => void;
};

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

export default (Vue as VueConstructor<Vue & LoadSectionDialog>).extend({
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

  data() {
    return {
      feedbackSchemeSections,
      surveySchemeSections,
      dialog: false,
      loading: false,
      search: null as string | null,
      schemes: [] as SchemeEntry[],
      selectedId: undefined as string | undefined,
    };
  },

  computed: {
    selectedSection(): any | undefined {
      const { section, selectedId } = this;
      if (!selectedId) return undefined;

      const scheme = this.schemes.find((item) => item.id === selectedId);
      if (!scheme) return undefined;

      if (isFeedbackSchemeEntry(scheme) && isFeedbackSchemeSection(section)) return scheme[section];

      if (isSurveySchemeEntry(scheme) && isSurveySchemeSection(section)) return scheme[section];

      return undefined;
    },
  },

  watch: {
    async dialog(val) {
      if (val && !this.schemes.length) await this.fetch();
    },
    search() {
      this.debouncedFetch();
    },
  },

  created() {
    this.debouncedFetch = debounce(() => {
      this.fetch();
    }, 500);
  },

  methods: {
    close() {
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    confirm() {
      if (!this.selectedSection) return;

      this.close();
      this.$emit('load', copy(this.selectedSection));
    },

    async fetch() {
      this.loading = true;

      try {
        const {
          data: { data },
        } = await this.$http.get<FeedbackSchemesResponse | SurveySchemesResponse>(
          `admin/${this.schemeType}-schemes`,
          { params: { search: this.search, limit: 10 } }
        );

        this.schemes = (data as SchemeEntry[])
          .filter((item) => item.id !== this.schemeId)
          .slice(0, 5);
      } finally {
        this.loading = false;
      }
    },

    async clear() {
      this.search = null;
      await this.fetch();
    },
  },
});
</script>
