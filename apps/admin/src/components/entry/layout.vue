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
          :label="$t('common.action.delete')"
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
    <v-dialog :value="routeLeave.dialog" max-width="350px" @input="handleLeave">
      <v-card>
        <v-card-title class="h2 justify-center">
          {{ $t('common.action.confirm.title') }}
        </v-card-title>
        <v-card-text class="px-6 py-4 d-flex justify-center">
          <div class="subtitle-1">
            {{ $t('common.action.confirm.msg') }}
          </div>
        </v-card-text>
        <v-container class="pa-6">
          <v-btn
            color="warning"
            :title="$t('common.action.continue')"
            block
            class="mb-2"
            dark
            large
            @click.stop="confirmLeave"
          >
            {{ $t('common.action.continue') }}
          </v-btn>
          <v-btn
            color="warning"
            :title="$t('common.action.cancel')"
            block
            outlined
            large
            @click.stop="cancelLeave"
          >
            {{ $t('common.action.cancel') }}
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import type { VueConstructor, PropType } from 'vue';
import Vue from 'vue';
import has from 'lodash/has';
import { ConfirmDialog } from '@intake24/ui';
import hasResource from '@intake24/admin/mixins/has-resource';
import type { RouteLeave } from '@intake24/admin/types';
import type { Dictionary } from '@intake24/common/types';

type Mixins = InstanceType<typeof hasResource>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'EntryLayout',

  components: { ConfirmDialog },

  mixins: [hasResource],

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

    handleLeave(value: boolean) {
      if (value) return;

      this.cancelLeave();
    },

    cancelLeave() {
      this.$emit('update:routeLeave', { dialog: false, to: null, confirmed: false });
    },

    confirmLeave() {
      const { dialog, to } = this.routeLeave;

      if (!to) return;

      this.$emit('update:routeLeave', { dialog, to, confirmed: true });
      // TODO: vue-router RawLocation and Route types are incompatible (RawLocation:name cannot be null)
      this.$router.push({ ...to, name: to.name ?? undefined });
    },

    async remove(): Promise<void> {
      const { id, name } = this.entry;

      await this.$http.delete(`${this.resource.api}/${this.id}`);
      this.$toasted.success(this.$t('common.msg.deleted', { name: name ?? id }).toString());
      await this.$router.push({ name: this.resource.name });
    },
  },
});
</script>
