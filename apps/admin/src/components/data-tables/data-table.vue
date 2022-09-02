<template>
  <div>
    <tool-bar :actions="actions" :api="api" :selected="tracked" @refresh="onRefresh"></tool-bar>
    <v-card :flat="isMobile" :outlined="!isMobile" :tile="isMobile">
      <v-card-text>
        <data-table-filter
          :count="meta.total"
          @filter-reset="resetFilter"
          @filter-set="setFilter"
        ></data-table-filter>
        <v-data-table
          v-model="selected"
          :footer-props="{
            'items-per-page-options': [25, 50, 100],
          }"
          :headers="headers"
          item-key="id"
          :items="items"
          :items-per-page="50"
          :loading="isAppLoading"
          :options.sync="options"
          :server-items-length="meta.total"
          show-select
        >
          <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
            <slot :name="scopedSlotName" v-bind="slotData" />
          </template>
          <template #[`item.action`]="{ item }">
            <action-bar
              :actions="actions.filter((action) => action !== 'create')"
              :api="api"
              class="text-right"
              :item="item"
              @refresh="onRefresh"
            ></action-bar>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { DataOptions } from 'vuetify';
import isEqual from 'lodash/isEqual';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import type { Pagination, PaginationMeta } from '@intake24/common/types/models';
import ToolBar from '@intake24/admin/components/toolbar/tool-bar.vue';
import { resource } from '@intake24/admin/mixins';
import { useResource } from '@intake24/admin/stores';

import ActionBar from './action-bar/action-bar.vue';
import DataTableFilter from './data-table-filter.vue';

export default defineComponent({
  name: 'DataTable',

  components: { ActionBar, DataTableFilter, ToolBar },

  mixins: [resource],

  props: {
    actions: {
      type: Array as PropType<string[]>,
      default: () => ['create', 'read', 'edit', 'delete'],
    },
    apiUrl: {
      type: String,
    },
    headers: {
      type: Array,
      required: true,
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },

  data() {
    return {
      items: [] as Dictionary[],
      meta: {} as PaginationMeta,
      options: {} as DataOptions,
      selected: [] as Dictionary[],
    };
  },

  computed: {
    ...mapState(useResource, { filter: 'getFilter' }),
    api(): string {
      return this.apiUrl ?? this.resource.api;
    },
    tracked(): string[] | number[] {
      return this.selected.map((item) => item[this.trackBy]);
    },
  },

  watch: {
    options: {
      async handler(val, oldVal) {
        if (!isEqual(val, oldVal)) await this.fetch();
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(useResource, {
      setResourceFilter: 'setFilter',
      resetResourceFilter: 'resetFilter',
    }),

    async fetch() {
      const {
        page,
        itemsPerPage: limit,
        sortBy: [column],
        sortDesc: [desc],
      } = this.options;

      const sort = column ? `${column}|${desc ? 'desc' : 'asc'}` : null;

      const {
        data: { data, meta },
      } = await this.$http.get<Pagination>(this.api, {
        params: { limit, page, sort, ...this.filter },
        withLoading: true,
      });
      this.items = data;
      this.meta = { ...meta };
    },

    async setFilter(data: Dictionary) {
      // this.clearSelected();
      await this.setResourceFilter(data);
      await this.fetch();
    },

    async resetFilter() {
      // this.clearSelected();
      await this.resetResourceFilter();
      await this.fetch();
    },

    async onRefresh() {
      // this.clearSelected();
      await this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
