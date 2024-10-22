<template>
  <tool-bar
    v-if="actions.length"
    v-bind="{ actions, api, selected: tracked }"
    @refresh="onRefresh"
  />
  <v-card
    v-bind="{ variant }"
    :flat="$vuetify.display.mobile"
    :rounded="$vuetify.display.mobile ? 0 : undefined"
  >
    <v-card-text>
      <data-table-filter
        :count="meta.total"
        @filter-reset="resetFilter"
        @filter-set="setFilter"
      />
      <v-data-table-server
        v-model="selected"
        v-model:options="options"
        :headers="headers"
        :item-value="trackBy"
        :items="items"
        :items-length="meta.total ?? 0"
        :items-per-page="50"
        :loading="isAppLoading"
        return-object
        show-select
      >
        <template v-for="(_, scopedSlotName) in $slots" #[scopedSlotName]="slotData">
          <slot :name="scopedSlotName" v-bind="slotData" />
        </template>
        <template #item.action="{ item }">
          <slot name="action" v-bind="{ item }">
            <action-bar
              :actions="actions.filter((action) => action !== 'create')"
              :api="api"
              :item="item"
              @refresh="onRefresh"
            />
          </slot>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { DataTableHeader } from './use-data-table';
import { mapActions } from 'pinia';

import { computed, defineComponent } from 'vue';
import ToolBar from '@intake24/admin/components/toolbar/tool-bar.vue';
import { useResource } from '@intake24/admin/stores';

import type { Dictionary } from '@intake24/common/types';
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
    variant: {
      type: String as PropType<'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'>,
      default: 'elevated',
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
