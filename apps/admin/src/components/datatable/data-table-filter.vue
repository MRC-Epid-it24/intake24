<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="filter.search"
          :label="$t('common.search._')"
          append-icon="fas fa-search"
          clearable
          hide-details="auto"
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
        <v-chip v-for="item in items" :key="item" pill color="orange darken-2" class="mr-1">
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
import { mapState } from 'pinia';
import isEmpty from 'lodash/isEmpty';
import { Dictionary } from '@intake24/common/types';
import { useResource } from '@intake24/admin/stores';

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
      filter: {} as Dictionary,
    };
  },

  computed: {
    ...mapState(useResource, { activeFilter: 'getFilter' }),
  },

  watch: {
    activeFilter: {
      handler(val) {
        this.filter = { ...(isEmpty(val) ? this.defaults : val) };
        this.refreshItems();
      },
      immediate: true,
    },
  },

  methods: {
    setFilter() {
      this.refreshItems();
      this.$emit('filter-set', this.filter);
    },
    resetFilter() {
      this.$emit('filter-reset');
    },
    refreshItems() {
      this.items = [...Object.values(this.filter)].filter((item) => item);
    },
  },
});
</script>

<style lang="scss" scoped></style>
