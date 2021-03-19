<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="auto">
          <slot name="header-add"></slot>
        </v-col>
        <v-col cols="12" sm>
          <v-text-field
            v-model="search"
            :label="$t('common.search._')"
            append-icon="fas fa-search"
            clearable
            dense
            hide-details="auto"
            outlined
            @click:append="setFilter"
            @click:clear="resetFilter"
            @keyup.enter="setFilter"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-data-table
      v-model="selected"
      :footer-props="{ 'items-per-page-options': [25, 50, 100] }"
      :headers="headers"
      :items="items"
      :item-key="trackBy"
      :items-per-page="50"
      :options.sync="options"
      :show-select="showSelect"
      :loading="isAppLoading"
      :server-items-length="meta.total"
      @item-selected="updateTracked"
    >
      <template v-for="(_, scopedSlotName) in $scopedSlots" v-slot:[scopedSlotName]="slotData">
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { DataOptions } from 'vuetify';
import isEqual from 'lodash/isEqual';
import { Dictionary } from '@common/types';
import handlesLoading from '@/mixins/handlesLoading';

type mixins = InstanceType<typeof handlesLoading>;

export default (Vue as VueConstructor<Vue & mixins>).extend({
  name: 'SurveyDataTable',

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
    showSelect: {
      type: Boolean,
      default: false,
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },

  data() {
    return {
      search: '',
      items: [] as Dictionary[],
      meta: {},
      options: {} as DataOptions,
      selected: [] as Dictionary[],
      tracked: [] as string[] | number[],
    };
  },

  watch: {
    options: {
      handler(val, oldVal) {
        if (!isEqual(val, oldVal)) this.fetch();
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
      const { search } = this;

      const sort = column ? `${column}|${desc ? 'desc' : 'asc'}` : null;

      try {
        const {
          data: { data, meta },
        } = await this.withLoading(
          this.$http.get(this.api, { params: { limit, page, search, sort } })
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

    setFilter() {
      this.fetch();
    },

    resetFilter() {
      this.search = '';
      this.fetch();
    },

    async onRefresh() {
      this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
