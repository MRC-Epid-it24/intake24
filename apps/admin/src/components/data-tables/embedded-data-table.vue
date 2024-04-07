<template>
  <div>
    <v-container fluid>
      <v-row justify="center">
        <v-col align-self="center" cols="12" sm="auto">
          <slot name="header-add" />
        </v-col>
        <v-col cols="12" sm>
          <v-text-field
            v-model="filter.search"
            clearable
            dense
            hide-details="auto"
            :label="$t('common.search._')"
            outlined
            prepend-inner-icon="$search"
            @click:append="setFilter"
            @click:clear="resetFilter"
            @keyup.enter="setFilter"
          />
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
    >
      <template v-for="(_, scopedSlotName) in $scopedSlots" #[scopedSlotName]="slotData">
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { defineComponent, ref } from 'vue';

import type { DataTableHeader } from './use-data-table';
import { useDataTable } from './use-data-table';

export default defineComponent({
  name: 'EmbeddedDataTable',

  props: {
    apiUrl: {
      type: String,
      required: true,
    },
    headers: {
      type: Array as PropType<DataTableHeader[]>,
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

  setup(props) {
    const filter = ref({ search: '' });

    const { api, fetch, items, meta, options, selected, tracked } = useDataTable(props, filter);

    const setFilter = async () => {
      await fetch();
    };

    const resetFilter = async () => {
      filter.value.search = '';
      await fetch();
    };

    watchDebounced(
      () => filter.value.search,
      async () => {
        await setFilter();
      },
      { debounce: 500, maxWait: 2000 },
    );

    return { api, fetch, items, meta, options, selected, tracked, filter, setFilter, resetFilter };
  },
});
</script>

<style lang="scss" scoped></style>
