<template>
  <div>
    <tool-bar :actions="actions" :api="api" :selected="tracked" @refresh="onRefresh"></tool-bar>
    <v-card :flat="isMobile" :tile="isMobile" :outlined="!isMobile">
      <v-card-text>
        <data-table-filter
          :count="meta.total"
          @filter-set="setFilter"
          @filter-reset="resetFilter"
        ></data-table-filter>
        <v-data-table
          v-model="selected"
          :footer-props="{
            'items-per-page-options': [25, 50, 100],
          }"
          :headers="headers"
          :items="items"
          item-key="id"
          :items-per-page="50"
          :options.sync="options"
          show-select
          :loading="isAppLoading"
          :server-items-length="meta.total"
        >
          <template v-for="(_, scopedSlotName) in $scopedSlots" v-slot:[scopedSlotName]="slotData">
            <slot :name="scopedSlotName" v-bind="slotData" />
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <action-bar
              :actions="actions.filter((action) => action !== 'create')"
              :api="api"
              :item="item"
              class="text-right"
              @refresh="onRefresh"
            ></action-bar>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import type { VueConstructor, PropType } from 'vue';
import Vue from 'vue';
import { mapActions, mapState } from 'pinia';
import type { DataOptions } from 'vuetify';
import isEqual from 'lodash/isEqual';
import type { Dictionary } from '@intake24/common/types';
import type { Pagination, PaginationMeta } from '@intake24/common/types/models';
import ToolBar from '@intake24/admin/components/toolbar/tool-bar.vue';
import handlesLoading from '@intake24/admin/mixins/handles-loading';
import hasResource from '@intake24/admin/mixins/has-resource';
import { useResource } from '@intake24/admin/stores';
import ActionBar from './action-bar/action-bar.vue';
import DataTableFilter from './data-table-filter.vue';

type Mixins = InstanceType<typeof handlesLoading> & InstanceType<typeof hasResource>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'DataTable',

  components: { ActionBar, DataTableFilter, ToolBar },

  mixins: [handlesLoading, hasResource],

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
      handler(val, oldVal) {
        if (!isEqual(val, oldVal)) this.fetch();
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

      try {
        const {
          data: { data, meta },
        } = await this.withLoading(
          this.$http.get<Pagination>(this.api, {
            params: { limit, page, sort, ...this.filter },
          })
        );

        this.items = data;
        this.meta = { ...meta };
      } catch {
        // continue
      }
    },

    async setFilter(data: Dictionary) {
      // this.clearSelected();
      await this.setResourceFilter(data);
      this.fetch();
    },

    async resetFilter() {
      // this.clearSelected();
      await this.resetResourceFilter();
      this.fetch();
    },

    async onRefresh() {
      // this.clearSelected();
      this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
