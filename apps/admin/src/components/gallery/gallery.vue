<template>
  <div>
    <tool-bar
      :actions="['create']"
      :api="resource.api"
      :selected="tracked"
      @refresh="refresh"
    />
    <v-card :border="!$vuetify.display.mobile" :flat="$vuetify.display.mobile" :tile="$vuetify.display.mobile">
      <v-card-text>
        <data-table-filter
          :count="meta.total"
          @filter-reset="resetFilter"
          @filter-set="setFilter"
        />
      </v-card-text>
    </v-card>
    <div v-show="meta.total" class="py-4 text-center">
      <v-pagination v-model="page" :length="meta.lastPage" rounded />
    </div>
    <v-container class="px-0">
      <v-row>
        <v-col v-for="item in items" :key="item.id" cols="12" lg="3" md="4" sm="6">
          <v-card :border="!$vuetify.display.mobile" :flat="$vuetify.display.mobile" height="100%" :tile="$vuetify.display.mobile">
            <router-link :to="{ name: `${module}-read`, params: { id: item.id } }">
              <v-img :src="item[imageUrl]" />
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

            <v-divider class="mx-4" />
            <v-card-actions>
              <v-btn
                v-if="can({ action: 'edit' })"
                class="font-weight-bold"
                color="info"
                :to="{ name: `${module}-edit`, params: { id: item.id } }"
                variant="text"
              >
                <v-icon icon="$edit" start />{{ $t(`common.action.edit`) }}
              </v-btn>
              <v-spacer />
              <confirm-dialog
                v-if="can({ action: 'delete' })"
                color="error"
                icon
                icon-left="$delete"
                :label="$t('common.action.delete')"
                variant="text"
                @confirm="remove(item)"
              >
                {{ $t('common.action.confirm.delete', { name: item.id }) }}
              </confirm-dialog>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <div v-show="meta.total" class="py-4 text-center">
        <v-pagination v-model="page" :length="meta.lastPage" rounded />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import type { Pagination, PaginationMeta } from '@intake24/db';
import { DataTableFilter } from '@intake24/admin/components/data-tables';
import ToolBar from '@intake24/admin/components/toolbar/tool-bar.vue';
import { resource } from '@intake24/admin/mixins';
import { useMessages, useResource } from '@intake24/admin/stores';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'ImageGallery',

  components: { ConfirmDialog, DataTableFilter, ToolBar },

  mixins: [resource],

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
      return this.selected.map(item => item[this.trackBy]);
    },
  },

  watch: {
    async page(val, oldVal) {
      if (val !== oldVal)
        await this.fetch();
    },
  },

  async mounted() {
    await this.fetch();
  },

  methods: {
    ...mapActions(useResource, {
      setResourceFilter: 'setFilter',
      resetResourceFilter: 'resetFilter',
    }),

    async fetch() {
      const { page, limit } = this;

      const {
        data: { data, meta },
      } = await this.$http.get<Pagination>(this.resource.api, {
        params: { limit, page, ...this.filter },
        withLoading: true,
      });
      this.items = data;
      this.meta = { ...meta };
    },

    async setFilter(data: Dictionary) {
      await this.setResourceFilter(data);
      await this.fetch();
    },

    async resetFilter() {
      await this.resetResourceFilter();
      await this.fetch();
    },

    async refresh() {
      await this.fetch();
    },

    async remove(item: Dictionary): Promise<void> {
      const { id, name } = item;

      await this.$http.delete(`${this.resource.api}/${id}`);
      useMessages().success(this.$t('common.msg.deleted', { name: name ?? id }));
      this.refresh();
    },
  },
});
</script>

<style lang="scss" scoped></style>
