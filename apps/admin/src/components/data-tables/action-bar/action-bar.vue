<template>
  <div>
    <component
      :is="action"
      v-for="action in currentActions"
      :key="`${action}-${item.id}`"
      :action="action"
      :item="item"
      :route="route"
      @action="onAction"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import upperFirst from 'lodash/upperFirst';
import { defineComponent } from 'vue';

import { useMessages } from '@intake24/admin/stores';

import Delete from './delete.vue';
import Download from './download.vue';
import Edit from './edit.vue';
import Read from './read.vue';

export default defineComponent({
  name: 'ActionBar',

  components: {
    Delete,
    Read,
    Download,
    Edit,
  },

  props: {
    actions: {
      type: Array as PropType<string[]>,
      default: () => ['read', 'edit', 'delete'],
    },
    item: {
      type: Object,
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

  emits: ['refresh'],

  computed: {
    currentActions(): string[] {
      const { ownerId, securables } = this.item;
      return this.actions.filter(action => this.can({ action, ownerId, securables }));
    },
    route(): string | null | undefined {
      return this.routePrefix ?? this.$route.name;
    },
  },

  methods: {
    async onAction(action: string): Promise<void> {
      // @ts-expect-error types
      await this[`on${upperFirst(action)}`]();
    },

    async onDelete(): Promise<void> {
      const { id } = this.item;

      await this.$http.delete(`${this.api}/${id}`);
      this.onSuccess('deleted');
    },

    async onSuccess(action: string): Promise<void> {
      const { id, name } = this.item;
      useMessages().success(this.$t(`common.msg.${action}`, { name: name ?? id }).toString());
      this.$emit('refresh');
    },
  },
});
</script>

<style lang="scss" scoped></style>
