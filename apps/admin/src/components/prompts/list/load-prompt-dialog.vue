<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-list-item v-bind="attrs" link v-on="on">
          <v-list-item-title>
            <v-icon left>$download</v-icon>
            {{ $t('survey-schemes.prompts.templates.add') }}
          </v-list-item-title>
        </v-list-item>
      </slot>
    </template>
    <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('survey-schemes.prompts.templates.title') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-text-field
          v-model="search"
          append-icon="$search"
          class="mb-4"
          clearable
          hide-details="auto"
          :label="$t('common.search._')"
          :loading="loading"
          outlined
          @click:append="fetch"
          @click:clear="clear"
          @keyup.enter="fetch"
        >
        </v-text-field>
        <v-alert v-if="promptAlreadyExists" text type="error">
          {{
            $t('survey-schemes.prompts.templates.alreadyExists', {
              promptId: selectedPrompt.promptId,
            })
          }}
        </v-alert>
        <v-list v-if="prompts.length" min-height="350px" two-line>
          <v-list-item-group v-model="selectedId">
            <template v-for="(prompt, idx) in prompts">
              <v-list-item :key="prompt.id" :value="prompt.id">
                <template #default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-avatar>
                    <v-icon>fas fa-question-circle</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ prompt.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ `ID: ${prompt.id} | Type: ${prompt.component}` }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
              <v-divider v-if="idx + 1 < prompts.length" :key="`div-${prompt.id}`"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <v-alert v-else color="secondary" text type="info">
          {{ $t('survey-schemes.prompts.templates.none') }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
          <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="!selectedId || promptAlreadyExists"
          text
          @click.stop="confirm"
        >
          <v-icon left>$success</v-icon>{{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import debounce from 'lodash/debounce';
import { defineComponent } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import { copy } from '@intake24/common/util';

export default defineComponent({
  name: 'LoadPromptDialog',

  props: {
    schemeId: {
      type: String,
      required: true,
    },
    promptIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<Prompt[]>,
    },
  },

  emits: ['load'],

  data() {
    return {
      dialog: false,
      loading: false,
      search: null as string | null,
      prompts: [] as Prompt[],
      selectedId: undefined as string | undefined,
    };
  },

  computed: {
    selectedPrompt(): Prompt | undefined {
      const { selectedId } = this;
      if (!selectedId) return undefined;

      return this.prompts.find((prompt) => prompt.id === selectedId);
    },
    promptAlreadyExists(): boolean {
      const match = this.promptIds.find((id) => id === this.selectedPrompt?.id);
      return !!match;
    },
  },

  watch: {
    async dialog(val) {
      if (val && !this.prompts.length) await this.fetch();
    },
    search() {
      //@ts-expect-error debounced
      this.debouncedFetch();
    },
  },

  created() {
    //@ts-expect-error fix debounced types
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
      if (!this.selectedPrompt) return;

      this.$emit('load', copy(this.selectedPrompt));
      this.close();
    },

    async fetch() {
      this.loading = true;

      try {
        this.prompts = this.items ? this.fetchLocally() : await this.fetchFromApi();
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

      const { data } = await this.$http.get<Prompt[]>(
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
