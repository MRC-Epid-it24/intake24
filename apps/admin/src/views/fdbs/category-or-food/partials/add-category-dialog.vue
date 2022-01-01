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
        <v-icon>$create</v-icon>
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
          @click:append="fetch"
          @click:clear="clear"
          @keyup.enter="fetch"
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
import Vue, { VueConstructor } from 'vue';
import { copy } from '@common/util';
import debounce from 'lodash/debounce';
import { CategoriesResponse, CategoryListEntry } from '@common/types/http/admin';
import { CategoryAttributes } from '@common/types/models';

type AddCategoryDialog = {
  debouncedFetch: () => void;
};

export default (Vue as VueConstructor<Vue & AddCategoryDialog>).extend({
  name: 'AddCategoryDialog',

  props: {
    currentList: {
      type: Array as () => CategoryAttributes[],
      default: () => [],
    },
    limit: {
      type: Number,
      default: 5,
    },
    localeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      search: null as string | null,
      items: [] as CategoryListEntry[],
      selected: [] as string[],
    };
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

  watch: {
    async dialog(val: boolean) {
      if (val && !this.items.length) await this.fetch();
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

    async fetch() {
      this.loading = true;

      try {
        const { limit, search } = this;

        const {
          data: { data },
        } = await this.$http.get<CategoriesResponse>(`admin/fdbs/${this.localeId}/categories`, {
          params: { search, limit },
        });

        this.items = data;
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
