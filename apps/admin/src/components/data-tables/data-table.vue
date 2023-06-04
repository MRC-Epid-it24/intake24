<template>
  <div>
    <tool-bar v-bind="{ actions, api, selected: tracked }" @refresh="onRefresh"></tool-bar>
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
          <template
            v-if="!Object.keys($scopedSlots).includes('item.action')"
            #[`item.action`]="{ item }"
          >
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
import { mapActions } from 'pinia';
import { computed, defineComponent } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import ToolBar from '@intake24/admin/components/toolbar/tool-bar.vue';
import { useResource } from '@intake24/admin/stores';

import type { DataTableHeader } from './use-data-table';
import { ActionBar } from './action-bar';
import DataTableFilter from './data-table-filter.vue';
import { useDataTable } from './use-data-table';

export default defineComponent({
  name: 'DataTable',

  components: { ActionBar, DataTableFilter, ToolBar },

  props: {
    actions: {
      type: Array as PropType<string[]>,
      default: () => ['create', 'read', 'edit', 'delete'],
    },
    apiUrl: {
      type: String,
    },
    headers: {
      type: Array as PropType<DataTableHeader[]>,
      required: true,
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },

  setup(props) {
    const resource = useResource();
    const filter = computed(() => resource.getFilter);
    const { api, fetch, items, meta, options, selected, tracked } = useDataTable(props, filter);

    return { api, fetch, items, meta, options, selected, tracked, filter };
  },

  methods: {
    ...mapActions(useResource, {
      setResourceFilter: 'setFilter',
      resetResourceFilter: 'resetFilter',
    }),

    async setFilter(data: Dictionary) {
      console.log('setFilter', data);
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
