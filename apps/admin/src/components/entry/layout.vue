<template>
  <div>
    <v-card outlined class="mb-5">
      <v-toolbar flat>
        <v-btn color="white" :title="$t(`common.action.back`)" :to="{ name: resource.name }">
          <v-icon left>$back</v-icon> {{ $t(`common.action.back`) }}
        </v-btn>
        <v-btn
          v-if="editsResource"
          class="ml-3"
          color="primary"
          :title="$t(`common.action.save`)"
          @click="$emit('save')"
        >
          <v-icon left>$save</v-icon> {{ $t(`common.action.save`) }}
        </v-btn>
        <slot name="actions"></slot>
        <v-spacer></v-spacer>
        <confirm-dialog
          v-if="canHandleEntry('delete')"
          :label="$t('common.action.delete').toString()"
          color="error"
          icon-left="$delete"
          @confirm="remove"
        >
          {{ $t('common.action.confirm.delete', { name: entry.name ? entry.name : entry.id }) }}
        </confirm-dialog>
      </v-toolbar>
    </v-card>
    <v-card :flat="isMobile" :tile="isMobile" :outlined="!isMobile">
      <v-tabs dark background-color="secondary">
        <v-tab
          v-for="tab in tabs"
          :key="tab"
          :to="{ name: `${resource.name}-${tab}`, params: { id } }"
          :title="tabTitle(tab)"
        >
          {{ tabTitle(tab) }}
        </v-tab>
      </v-tabs>
      <slot></slot>
    </v-card>
    <slot name="addons"></slot>
    <confirm-leave-dialog
      :value="routeLeave"
      @input="$emit('update:routeLeave', $event)"
    ></confirm-leave-dialog>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import has from 'lodash/has';
import { defineComponent } from 'vue';

import type { RouteLeave } from '@intake24/admin/types';
import type { Dictionary } from '@intake24/common/types';
import { resource } from '@intake24/admin/mixins';
import { useMessages } from '@intake24/admin/stores';
import { ConfirmDialog } from '@intake24/ui';

import ConfirmLeaveDialog from './confirm-leave-dialog.vue';

export default defineComponent({
  name: 'EntryLayout',

  components: { ConfirmDialog, ConfirmLeaveDialog },

  mixins: [resource],

  inject: {
    editsResource: { default: false },
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    entry: {
      type: Object as PropType<Dictionary>,
      required: true,
    },
    routeLeave: {
      type: Object as PropType<RouteLeave>,
      default: () => ({
        dialog: false,
        to: null,
        confirmed: false,
      }),
    },
  },

  computed: {
    isCreate(): boolean {
      return this.id === 'create';
    },
    tabs(): string[] {
      if (this.isCreate) return ['create'];

      const { securables, ownerId } = this.entry;

      return this.resource.routes.filter(
        (item) => item !== 'create' && this.can({ action: item, securables, ownerId })
      );
    },
  },

  methods: {
    canHandleEntry(action: string) {
      if (this.isCreate) return false;

      const { securables, ownerId } = this.entry;
      return this.can({ action, securables, ownerId });
    },

    tabTitle(tab: string) {
      const check = has(this.$i18n.messages[this.$i18n.locale], `${this.module}.${tab}.tab`);
      return this.$t(check ? `${this.module}.${tab}.tab` : `common.action.${tab}`);
    },

    async remove(): Promise<void> {
      const { id, name } = this.entry;

      await this.$http.delete(`${this.resource.api}/${this.id}`);
      useMessages().success(this.$t('common.msg.deleted', { name: name ?? id }).toString());
      await this.$router.push({ name: this.resource.name });
    },
  },
});
</script>
