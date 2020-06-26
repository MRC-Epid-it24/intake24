<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="filter.search"
          append-icon="fas fa-search"
          clearable
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
    <v-row justify="space-between">
      <v-col col="12" sm="auto">
        {{ $t('common.search.filter') }}:
        <v-chip v-for="item in items" :key="item" pill color="orange" class="mr-1">
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
import Vue from 'vue';
import isEmpty from 'lodash/isEmpty';
import { AnyDictionary } from '@common/types/common';

export default Vue.extend({
  name: 'DataTableFilter',

  props: {
    count: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      items: [] as string[],
      defaults: { search: '' },
      filter: {} as AnyDictionary,
    };
  },

  computed: {
    refsLoaded(): boolean {
      return !!Object.keys(this.$store.state[this.module].refs).length;
    },
    filterRefs(): AnyDictionary {
      return this.$store.state[this.module].refs?.filter ?? {};
    },
    activeFilter(): AnyDictionary {
      return this.$store.state[this.module].filter.data;
    },
  },

  watch: {
    activeFilter: {
      handler(val) {
        this.filter = { ...(isEmpty(val) ? this.defaults : val) };
        this.loadApplied();
      },
      immediate: true,
    },
    filterRefs(val) {
      if (Object.keys(val).length) this.loadApplied();
    },
  },

  methods: {
    setFilter() {
      this.loadApplied();
      this.$emit('filter-set', this.filter);
    },
    resetFilter() {
      this.$emit('filter-reset');
    },
    loadApplied() {
      this.items = [];
      Object.keys(this.filter).forEach((key) => {
        if (Array.isArray(this.filter[key]) && this.filterRefs) {
          const stores = this.filterRefs[key].reduce((acc: string[], item: AnyDictionary) => {
            if (this.filter[key].includes(item.id)) acc.push(item.name);
            return acc;
          }, []);
          this.items = this.items.concat(stores);
        } else this.items.push(this.filter[key]);
      });
      this.items = this.items.filter((item) => item);
    },
  },
});
</script>

<style lang="scss" scoped></style>
