<template>
  <div>
    <toolbar :actions="actions" :api="api" :selected="tracked" @refresh="onRefresh"></toolbar>
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
            <actionbar
              :actions="actions.filter((action) => action !== 'create')"
              :api="api"
              :item="item"
              class="text-right"
              @refresh="onRefresh"
            ></actionbar>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import { DataOptions } from 'vuetify';
import isEqual from 'lodash/isEqual';
import { Dictionary } from '@common/types';
import { Pagination, PaginationMeta } from '@common/types/models';
import Actionbar from '@/components/datatable/actionbar/Actionbar.vue';
import Toolbar from '@/components/toolbar/Toolbar.vue';
import handlesLoading from '@/mixins/handlesLoading';
import ResourceMixin from '@/mixins/ResourceMixin';
import DataTableFilter from './DataTableFilter.vue';

type Mixins = InstanceType<typeof handlesLoading> & InstanceType<typeof ResourceMixin>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'DataTable',

  components: { Actionbar, DataTableFilter, Toolbar },

  mixins: [handlesLoading, ResourceMixin],

  props: {
    actions: {
      type: Array as () => string[],
      default: (): string[] => ['create', 'read', 'edit', 'delete'],
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
    ...mapGetters({ filter: 'resource/filter' }),
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
      await this.$store.dispatch(`resource/setFilter`, data);
      this.fetch();
    },

    async resetFilter() {
      // this.clearSelected();
      await this.$store.dispatch(`resource/resetFilter`);
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
