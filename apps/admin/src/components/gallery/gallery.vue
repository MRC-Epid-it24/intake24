<template>
  <div>
    <tool-bar
      :actions="['create']"
      :api="resource.api"
      :selected="tracked"
      @refresh="refresh"
    ></tool-bar>
    <v-card :flat="isMobile" :tile="isMobile" :outlined="!isMobile">
      <v-card-text>
        <data-table-filter
          :count="meta.total"
          @filter-set="setFilter"
          @filter-reset="resetFilter"
        ></data-table-filter>
      </v-card-text>
    </v-card>
    <div v-show="meta.total" class="py-4 text-center">
      <v-pagination v-model="page" :length="meta.lastPage" circle></v-pagination>
    </div>
    <v-container class="px-0">
      <v-row>
        <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
          <v-card :flat="isMobile" :tile="isMobile" :outlined="!isMobile" height="100%">
            <router-link :to="{ name: `${module}-read`, params: { id: item.id } }">
              <v-img :src="item[imageUrl]"></v-img>
            </router-link>
            <v-card-title>
              <slot name="title">
                {{ item[title] }}
              </slot>
            </v-card-title>
            <v-card-subtitle>
              <slot name="subtitle">
                {{ item[subtitle] }}
              </slot>
            </v-card-subtitle>

            <v-divider class="mx-4"></v-divider>
            <v-card-actions>
              <v-btn
                v-if="can({ action: 'edit' })"
                :to="{ name: `${module}-edit`, params: { id: item.id } }"
                class="font-weight-bold"
                color="blue darken-3"
                text
              >
                <v-icon left>$edit</v-icon> {{ $t(`common.action.edit`) }}
              </v-btn>
              <v-spacer></v-spacer>
              <confirm-dialog
                v-if="can({ action: 'delete' })"
                :label="$t('common.action.delete')"
                color="error"
                icon
                icon-left="$delete"
                @confirm="remove(item)"
              >
                {{ $t('common.action.confirm.delete', { name: item.id }) }}
              </confirm-dialog>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <div v-show="meta.total" class="py-4 text-center">
        <v-pagination v-model="page" :length="meta.lastPage" circle></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { Dictionary } from '@intake24/common/types';
import { Pagination, PaginationMeta } from '@intake24/common/types/models';
import { ConfirmDialog } from '@intake24/ui';
import ToolBar from '@intake24/admin/components/toolbar/tool-bar.vue';
import handlesLoading from '@intake24/admin/mixins/handles-loading';
import hasResource from '@intake24/admin/mixins/has-resource';
import DataTableFilter from '@intake24/admin/components/datatable/data-table-filter.vue';
import { useResource } from '@intake24/admin/stores';

type Mixins = InstanceType<typeof handlesLoading> & InstanceType<typeof hasResource>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'ImageGallery',

  components: { ConfirmDialog, DataTableFilter, ToolBar },

  mixins: [handlesLoading, hasResource],

  props: {
    title: {
      type: String,
      default: 'title',
    },
    subtitle: {
      type: String,
      default: 'subtitle',
    },
    imageUrl: {
      type: String,
      default: 'imageUrl',
    },
    actions: {
      type: Array as PropType<string[]>,
      default: () => ['create', 'read', 'edit', 'delete'],
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
      page: 1,
      limit: 50,
      selected: [] as Dictionary[],
    };
  },

  computed: {
    ...mapState(useResource, { filter: 'getFilter' }),
    tracked(): string[] | number[] {
      return this.selected.map((item) => item[this.trackBy]);
    },
  },

  watch: {
    page(val, oldVal) {
      if (val !== oldVal) this.fetch();
    },
  },

  mounted() {
    this.fetch();
  },

  methods: {
    ...mapActions(useResource, {
      setResourceFilter: 'setFilter',
      resetResourceFilter: 'resetFilter',
    }),

    async fetch() {
      const { page, limit } = this;

      try {
        const {
          data: { data, meta },
        } = await this.withLoading(
          this.$http.get<Pagination>(this.resource.api, {
            params: { limit, page, ...this.filter },
          })
        );

        this.items = data;
        this.meta = { ...meta };
      } catch {
        // continue
      }
    },

    async setFilter(data: Dictionary) {
      await this.setResourceFilter(data);
      this.fetch();
    },

    async resetFilter() {
      await this.resetResourceFilter();
      this.fetch();
    },

    async refresh() {
      this.fetch();
    },

    async remove(item: Dictionary): Promise<void> {
      const { id, name } = item;

      await this.$http.delete(`${this.resource.api}/${id}`);
      this.$toasted.success(this.$t('common.msg.deleted', { name: name ?? id }).toString());
      this.refresh();
    },
  },
});
</script>

<style lang="scss" scoped></style>
