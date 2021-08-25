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
          :title="$t('schemes.questions.templates.add')"
        >
          <v-icon>fa-download</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card :loading="loading">
      <v-card-title>{{ $t('schemes.questions.templates.title') }}</v-card-title>
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
            $t('schemes.questions.templates.alreadyExists', {
              questionId: selectedQuestion.questionId,
            })
          }}
        </v-alert>
        <v-list v-if="templates.length" min-height="350px" two-line>
          <v-list-item-group v-model="selectedId">
            <template v-for="(template, idx) in templates">
              <v-list-item :key="template.id" :value="template.id">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-avatar>
                    <v-icon>fa-question-circle</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ template.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ `ID: ${template.id} | Type: ${template.component}` }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
              <v-divider v-if="idx + 1 < templates.length" :key="`div-${template.id}`"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <v-alert v-else color="primary" text type="info">
          {{ $t('schemes.questions.templates.none') }}
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
import Vue, { VueConstructor } from 'vue';
import clone from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { SchemeQuestionTemplatesResponse } from '@common/types/http/admin';
import { PromptQuestion } from '@common/prompts';

type LoadTemplateDialog = {
  debouncedFetch: () => void;
};

export default (Vue as VueConstructor<Vue & LoadTemplateDialog>).extend({
  name: 'LoadTemplateDialog',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    questionIds: {
      type: Array as () => string[],
      default: () => [],
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      search: null as string | null,
      templates: [] as PromptQuestion[],
      selectedId: undefined as string | undefined,
    };
  },

  computed: {
    selectedQuestion(): PromptQuestion | undefined {
      const { selectedId } = this;
      if (!selectedId) return undefined;

      return this.templates.find((template) => template.id === selectedId);
    },
    questionAlreadyExists(): boolean {
      const match = this.questionIds.find((id) => id === this.selectedQuestion?.id);
      return !!match;
    },
  },

  watch: {
    async dialog(val) {
      if (val && !this.templates.length) await this.fetch();
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
      if (!this.selectedQuestion) return;

      this.close();
      this.$emit('load', clone(this.selectedQuestion));
    },

    async fetch() {
      this.loading = true;

      try {
        const {
          data: { data },
        } = await this.$http.get<SchemeQuestionTemplatesResponse>(
          `admin/schemes/${this.schemeId}/templates`,
          { params: { search: this.search, limit: 5 } }
        );

        this.templates = data;
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
