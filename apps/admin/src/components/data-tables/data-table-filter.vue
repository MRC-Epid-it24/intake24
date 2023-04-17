<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="filter.search"
          clearable
          hide-details="auto"
          :label="$t('common.search._')"
          outlined
          prepend-inner-icon="$search"
          @click:clear="resetFilter"
          @click:prepend="setFilter"
          @keyup.enter="setFilter"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col col="12" sm="auto">
        {{ $t('common.search.filter') }}:
        <v-chip v-for="item in items" :key="item" class="mr-1" color="orange darken-2" pill>
          {{ item }}
        </v-chip>
      </v-col>
      <v-col col="12" sm="auto">
        {{ $t('common.search.count') }}:
        <span>{{ count }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { watchDebounced } from '@vueuse/core';
import isEmpty from 'lodash/isEmpty';
import { computed, defineComponent, ref, watch } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import { useResource } from '@intake24/admin/stores';

export default defineComponent({
  name: 'DataTableFilter',

  props: {
    count: {
      type: Number,
      default: 0,
    },
  },

  emits: ['filter-set', 'filter-reset'],

  setup(props, { emit }) {
    const { getFilter } = useResource();

    const items = ref<string[]>([]);
    const defaults = ref({ search: '' });
    const filter = ref<Dictionary>({});

    const currentSearch = computed(() => filter.value.search);

    const refreshItems = () => {
      items.value = [...Object.values(filter.value)].filter((item) => item);
    };

    const setFilter = () => {
      refreshItems();
      emit('filter-set', filter.value);
    };
    const resetFilter = () => {
      emit('filter-reset');
    };

    watch(
      () => getFilter.value,
      (val) => {
        filter.value = { ...(isEmpty(val) ? defaults.value : val) };
        refreshItems();
      },
      { immediate: true }
    );

    watchDebounced(
      currentSearch,
      () => {
        setFilter();
      },
      { debounce: 500, maxWait: 2000 }
    );

    return {
      items,
      defaults,
      filter,
      setFilter,
      resetFilter,
    };
  },
});
</script>

<style lang="scss" scoped></style>
