<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          color="secondary"
          fab
          small
          :title="$t('survey-schemes.questions.templates.add')"
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
          {{ $t('survey-schemes.questions.templates.title') }}
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
        <v-alert v-if="questionAlreadyExists" text type="error">
          {{
            $t('survey-schemes.questions.templates.alreadyExists', {
              questionId: selectedQuestion.questionId,
            })
          }}
        </v-alert>
        <v-list v-if="questions.length" min-height="350px" two-line>
          <v-list-item-group v-model="selectedId">
            <template v-for="(question, idx) in questions">
              <v-list-item :key="question.id" :value="question.id">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-avatar>
                    <v-icon>fa-question-circle</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ question.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ `ID: ${question.id} | Type: ${question.component}` }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
              <v-divider v-if="idx + 1 < questions.length" :key="`div-${question.id}`"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <v-alert v-else color="primary" text type="info">
          {{ $t('survey-schemes.questions.templates.none') }}
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
          :disabled="!selectedId || questionAlreadyExists"
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
import { defineComponent } from 'vue';
import { copy } from '@intake24/common/util';
import debounce from 'lodash/debounce';
import type { PromptQuestion } from '@intake24/common/prompts';

export default defineComponent({
  name: 'LoadPromptDialog',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    questionIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<PromptQuestion[]> | undefined,
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      search: null as string | null,
      questions: [] as PromptQuestion[],
      selectedId: undefined as string | undefined,
    };
  },

  computed: {
    selectedQuestion(): PromptQuestion | undefined {
      const { selectedId } = this;
      if (!selectedId) return undefined;

      return this.questions.find((question) => question.id === selectedId);
    },
    questionAlreadyExists(): boolean {
      const match = this.questionIds.find((id) => id === this.selectedQuestion?.id);
      return !!match;
    },
  },

  watch: {
    async dialog(val) {
      if (val && !this.questions.length) await this.fetch();
    },
    search() {
      //@ts-expect-error debounced
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
      this.selectedId = undefined;
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    confirm() {
      if (!this.selectedQuestion) return;

      this.$emit('load', copy(this.selectedQuestion));
      this.close();
    },

    async fetch() {
      this.loading = true;

      try {
        this.questions = this.items ? this.fetchLocally() : await this.fetchFromApi();
      } finally {
        this.loading = false;
      }
    },

    fetchLocally() {
      const { search } = this;
      const items = this.items ?? [];

      const filtered = items.filter((item) => {
        return search ? item.name.match(new RegExp(search, 'i')) : true;
      });

      return filtered.slice(0, 5);
    },

    async fetchFromApi() {
      const { search } = this;

      const { data } = await this.$http.get<PromptQuestion[]>(
        `admin/survey-schemes/${this.schemeId}/templates`,
        { params: { search, limit: 5 } }
      );

      return data;
    },

    async clear() {
      this.search = null;
      await this.fetch();
    },
  },
});
</script>
