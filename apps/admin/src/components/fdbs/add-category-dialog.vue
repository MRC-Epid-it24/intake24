<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        color="secondary"
        fab
        small
        :title="$t('fdbs.categories.add')"
      >
        <v-icon>$add</v-icon>
      </v-btn>
    </template>
    <v-card :loading="loading">
      <v-toolbar color="primary" dark flat>
        <v-btn :title="$t('common.action.cancel')" icon dark @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('fdbs.categories.title') }}
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
        <v-alert v-if="itemAlreadyIncluded" text type="error">
          {{ $t('fdbs.categories.alreadyIncluded', { code: selectedItems[0].code }) }}
        </v-alert>
        <v-list v-if="items.length" min-height="350px" two-line>
          <v-list-item-group v-model="selected" multiple>
            <template v-for="(item, idx) in items">
              <v-list-item :key="item.code" :value="item.code">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-avatar>
                    <v-icon>fa-list</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.code }} | {{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
              <v-divider v-if="idx + 1 < items.length" :key="`div-${item.code}`"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <v-alert v-else color="primary" text type="info">
          {{ $t('fdbs.categories.none') }}
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
          :disabled="!selected.length || itemAlreadyIncluded"
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

import type { CategoriesResponse, CategoryListEntry } from '@intake24/common/types/http/admin';
import type { CategoryAttributes } from '@intake24/common/types/models';
import { copy } from '@intake24/common/util';

import { useFetchList } from './use-fetch-list';

export default defineComponent({
  name: 'AddCategoryDialog',

  props: {
    currentList: {
      type: Array as PropType<CategoryAttributes[]>,
      default: () => [],
    },
    localeId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const selected = ref<string[]>([]);

    const { dialog, loading, search, items, fetch, clear } = useFetchList<
      CategoriesResponse['data'][number]
    >('admin/fdbs/:id/categories', props.localeId);

    return { dialog, loading, items, search, selected, fetch, clear };
  },

  computed: {
    selectedItems(): CategoryListEntry[] {
      const { selected } = this;
      if (!selected.length) return [];

      return this.items.filter((item) => selected.includes(item.code));
    },
    itemAlreadyIncluded(): boolean {
      if (!this.currentList.length || !this.selectedItems.length) return false;
      const codes = this.currentList.map((item) => item.code);

      return this.selectedItems.some((item) => codes.includes(item.code));
    },
  },

  methods: {
    close() {
      this.selected = [];
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    confirm() {
      if (!this.selectedItems.length) return;

      this.$emit('add', copy(this.selectedItems));
      this.close();
    },
  },
});
</script>
