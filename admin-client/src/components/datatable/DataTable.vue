<template>
  <div>
    <toolbar :api="api" :selected="tracked" @refresh="onRefresh"></toolbar>
    <v-card outlined>
      <v-card-text>
        <data-table-filter
          :count="meta.total"
          @filter-set="onFilterSet"
          @filter-reset="onFilterReset"
        ></data-table-filter>
        <v-data-table
          v-model="selected"
          :footer-props="{
            'items-per-page-options': [25, 50, 100],
          }"
          :headers="headers"
          :items="items"
          item-key="id"
          :options.sync="options"
          show-select
          :loading="isLoading"
          :server-items-length="meta.total"
          @item-selected="updateTracked"
        >
          <template v-for="(_, scopedSlotName) in $scopedSlots" v-slot:[scopedSlotName]="slotData">
            <slot :name="scopedSlotName" v-bind="slotData" />
          </template>
          <template v-slot:item.action="{ item }">
            <actionbar :api="api" :item="item" class="text-right" @refresh="onRefresh"></actionbar>
          </template>
        </v-data-table>
        <div class="text-center">
          <v-pagination
            v-model="options.page"
            :length="meta.lastPage"
            :total-visible="10"
            @input="fetch"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { DataOptions } from 'vuetify';
import { AnyDictionary } from '@common/types/common';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import Toolbar from '@/components/toolbar/Toolbar.vue';
import handlesLoading from '@/mixins/handlesLoading';
import DataTableFilter from './DataTableFilter.vue';

type mixins = InstanceType<typeof handlesLoading>;

export default (Vue as VueConstructor<Vue & mixins>).extend({
  name: 'DataTable',

  components: { Actionbar, DataTableFilter, Toolbar },

  mixins: [handlesLoading],

  props: {
    api: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    sortOrder: {
      type: Array,
      default() {
        return [];
      },
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },

  data() {
    return {
      items: [] as AnyDictionary[],
      meta: {},
      options: {} as DataOptions,
      selected: [] as AnyDictionary[],
      tracked: [] as string[] | number[],
    };
  },

  computed: {
    filter(): AnyDictionary {
      return this.$store.state[this.module].filter.data;
    },
  },

  watch: {
    options: {
      handler() {
        // this.$store.dispatch(`${this.module}/request`);
        this.fetch();
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

      const sort = column ? `${column}|${desc ? 'desc' : 'asc'}` : null;

      try {
        const {
          data: { data, meta },
        } = await this.withLoading(
          this.$http.get(this.api, { params: { limit, page, sort, ...this.filter } })
        );

        this.items = data;
        this.meta = { ...meta };
      } catch {
        // continue
      }
    },

    updateTracked() {
      this.tracked = this.selected.map((item) => item[this.trackBy]);
    },

    async onFilterSet(data: AnyDictionary) {
      // this.clearSelected();
      await this.$store.dispatch(`${this.module}/filter/add`, data);
      this.fetch();
    },

    async onFilterReset() {
      // this.clearSelected();
      await this.$store.dispatch(`${this.module}/filter/reset`);
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
