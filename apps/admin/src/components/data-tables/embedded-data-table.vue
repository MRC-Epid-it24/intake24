<template>
  <div>
    <v-container fluid>
      <v-row justify="center">
        <v-col align-self="center" cols="12" sm="auto">
          <slot name="header-add"></slot>
        </v-col>
        <v-col cols="12" sm>
          <v-text-field
            v-model="search"
            append-icon="fas fa-search"
            clearable
            dense
            hide-details="auto"
            :label="$t('common.search._')"
            outlined
            @click:append="setFilter"
            @click:clear="resetFilter"
            @keyup.enter="setFilter"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-data-table
      v-model="selected"
      :footer-props="{ 'items-per-page-options': [25, 50, 100] }"
      :headers="headers"
      :item-key="trackBy"
      :items="items"
      :items-per-page="50"
      :loading="isAppLoading"
      :options.sync="options"
      :server-items-length="meta.total"
      :show-select="showSelect"
      @item-selected="updateTracked"
    >
      <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import type { DataOptions } from 'vuetify';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import type { PaginationMeta } from '@intake24/common/types/models';

export default defineComponent({
  name: 'SurveyDataTable',

  props: {
    api: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },

  data() {
    return {
      search: '',
      items: [] as Dictionary[],
      meta: {} as PaginationMeta,
      options: {} as DataOptions,
      selected: [] as Dictionary[],
      tracked: [] as string[] | number[],
    };
  },

  watch: {
    options: {
      async handler(val, oldVal) {
        if (!isEqual(val, oldVal)) await this.fetch();
      },
      deep: true,
    },
    selected() {
      this.updateTracked();
    },
  },

  methods: {
    async fetch() {
      const {
        page,
        itemsPerPage: limit,
        sortBy: [column],
        sortDesc: [desc],
      } = this.options;
      const { search } = this;

      const sort = column ? `${column}|${desc ? 'desc' : 'asc'}` : null;

      const {
        data: { data, meta },
      } = await this.$http.get(this.api, {
        params: { limit, page, search, sort },
        withLoading: true,
      });

      this.items = data;
      this.meta = { ...meta };
    },

    updateTracked() {
      this.tracked = this.selected.map((item) => item[this.trackBy]);
    },

    async setFilter() {
      await this.fetch();
    },

    async resetFilter() {
      this.search = '';
      await this.fetch();
    },

    async onRefresh() {
      await this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
