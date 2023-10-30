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
          class="mb-4"
          clearable
          hide-details="auto"
          :label="$t('common.search._')"
          :loading="loading"
          outlined
          prepend-inner-icon="$search"
          @click:append="fetch"
          @click:clear="clear"
          @keyup.enter="fetch"
        >
        </v-text-field>
        <v-alert v-if="promptAlreadyExists" text type="error">
          {{
            $t('survey-schemes.prompts.templates.alreadyExists', {
              promptId: selectedPrompt?.id,
            })
          }}
        </v-alert>
        <template v-if="prompts.length">
          <v-list min-height="350px" two-line>
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
          <div class="text-center">
            <v-pagination v-model="page" circle :length="lastPage"></v-pagination>
          </div>
        </template>
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
import { watchDebounced } from '@vueuse/core';
import { computed, defineComponent, ref, watch } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { SurveySchemeTemplates } from '@intake24/common/types/http/admin';
import { useHttp } from '@intake24/admin/services';
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

  setup(props) {
    const http = useHttp();

    const dialog = ref(false);
    const loading = ref(false);

    const page = ref<number>(1);
    const lastPage = ref<number | undefined>();
    const search = ref<string | null>(null);

    const prompts = ref<Prompt[]>([]);
    const selectedId = ref<string | undefined>();

    const selectedPrompt = computed(() => {
      if (!selectedId.value) return undefined;

      return prompts.value.find((prompt) => prompt.id === selectedId.value);
    });

    const promptAlreadyExists = computed(() => {
      const match = props.promptIds.find((id) => id === selectedPrompt.value?.id);
      return !!match;
    });

    const fetchLocally = async (search: string | null, page: number, limit = 5) => {
      const currentPage = page - 1;

      const filtered = (props.items ?? []).filter((currentItem) =>
        search ? currentItem.name.match(new RegExp(search, 'i')) : true
      );

      const items = filtered.slice(currentPage * limit, currentPage * limit + limit);
      const lastPage = Math.floor(filtered.length / limit) + 1;

      return { items, lastPage };
    };

    const fetchFromApi = async (search: string | null, page: number, limit = 5) => {
      const {
        data: {
          data: items,
          meta: { lastPage },
        },
      } = await http.get<SurveySchemeTemplates>(
        `admin/survey-schemes/${props.schemeId}/templates`,
        { params: { search, page, limit } }
      );

      return { items, lastPage };
    };

    const fetch = async () => {
      loading.value = true;

      try {
        const result = props.items
          ? await fetchLocally(search.value, page.value)
          : await fetchFromApi(search.value, page.value);

        prompts.value = result.items;
        lastPage.value = result.lastPage;
      } finally {
        loading.value = false;
      }
    };

    const clear = async () => {
      search.value = null;
      await fetch();
    };

    watch(dialog, async (val) => {
      if (val && !prompts.value.length) await fetch();
    });

    watch(page, async () => {
      await fetch();
    });

    watchDebounced(
      search,
      () => {
        page.value = 1;
        fetch();
      },
      { debounce: 500, maxWait: 2000 }
    );

    return {
      dialog,
      loading,
      prompts,
      selectedId,
      page,
      lastPage,
      search,
      promptAlreadyExists,
      selectedPrompt,
      fetch,
      clear,
    };
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
  },
});
</script>
