<template>
  <v-card outlined class="mb-5">
    <v-toolbar>
      <template v-for="action in ['create', 'read', 'edit']">
        <component
          :is="action"
          v-if="currentActions.includes(action)"
          :key="action"
          :action="action"
          :disabled="selected.length !== 1"
          class="mr-2"
          @action="onAction"
        ></component>
      </template>
      <v-spacer></v-spacer>
      <confirm-dialog
        v-if="currentActions.includes('delete')"
        :disabled="!selected.length"
        :label="$t('common.action.delete').toString()"
        color="error"
        icon-left="$delete"
        @confirm="onDelete"
      >
        {{ $t('common.action.confirm.multi.delete', { count: selected.length }) }}
      </confirm-dialog>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Location } from 'vue-router';
import upperFirst from 'lodash/upperFirst';
import { defineComponent } from 'vue';

import { ConfirmDialog } from '@intake24/ui';
import { useMessages } from '@intake24/ui/stores';

import Create from './create.vue';
import Edit from './edit.vue';
import Read from './read.vue';

export default defineComponent({
  name: 'ToolBar',

  components: {
    ConfirmDialog,
    Create,
    Read,
    Edit,
  },

  props: {
    actions: {
      type: Array as PropType<string[]>,
      default: () => ['create', 'read', 'edit', 'delete'],
    },
    selected: {
      type: Array as PropType<(number | string)[]>,
      required: true,
    },
    api: {
      type: String,
      required: true,
    },
    routePrefix: {
      type: String,
    },
  },

  computed: {
    currentActions(): string[] {
      return this.actions.filter((action) => this.can({ action }));
    },
    route(): string | null | undefined {
      return this.routePrefix ?? this.$route.name;
    },
  },

  methods: {
    async onAction(action: string) {
      //@ts-expect-error types
      await this[`on${upperFirst(action)}`]();
    },

    async onRead() {
      const id = this.getOneSelected();
      if (!id) return;

      await this.$router.push({ name: `${this.route}-read`, params: { id } } as Location);
    },

    async onEdit() {
      const id = this.getOneSelected();
      if (!id) return;

      await this.$router.push({ name: `${this.route}-edit`, params: { id } } as Location);
    },

    async onDelete() {
      const id = this.getAtLeastOneSelected();
      if (!id) return;

      await this.$http.delete(this.api, { params: { id } });
      useMessages().success(this.$t('common.msg.multi.deleted').toString());
      this.onDraw();
    },

    getOneSelected() {
      if (this.selected.length !== 1) {
        useMessages().info(this.$t('Select one item to view/edit details.').toString());
        return false;
      }
      return this.selected[0];
    },

    getAtLeastOneSelected() {
      if (!this.selected.length) {
        useMessages().info(this.$t('Select at least one item.').toString());
        return false;
      }
      return this.selected;
    },

    onDraw() {
      this.$emit('refresh');
    },
  },
});
</script>

<style lang="scss" scoped></style>
