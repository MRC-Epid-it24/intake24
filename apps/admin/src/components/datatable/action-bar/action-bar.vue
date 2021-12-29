<template>
  <div>
    <component
      :is="action"
      v-for="action in currentActions"
      :key="`${action}-${item.id}`"
      :item="item"
      :action="action"
      :route="route"
      @action="onAction"
    >
    </component>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import upperFirst from 'lodash/upperFirst';
import Delete from './delete.vue';
import Read from './read.vue';
import Download from './download.vue';
import Edit from './edit.vue';

interface Actionable {
  [key: string]: () => Promise<void>;
}

export default (Vue as VueConstructor<Vue & Actionable>).extend({
  name: 'ActionBar',

  components: {
    Delete,
    Read,
    Download,
    Edit,
  },

  props: {
    actions: {
      type: Array as () => string[],
      default: (): string[] => ['read', 'edit', 'delete'],
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

  computed: {
    currentActions(): string[] {
      return this.actions.filter((action) => this.can({ action }));
    },
    route(): string {
      return this.routePrefix ?? this.$route.name;
    },
  },

  methods: {
    onAction(action: string): void {
      this[`on${upperFirst(action)}`]();
    },

    async onDelete(): Promise<void> {
      const { id } = this.item;

      await this.$http.delete(`${this.api}/${id}`);
      this.onSuccess('deleted');
    },

    onSuccess(action: string): void {
      const { id, name } = this.item;
      this.$toasted.success(this.$t(`common.msg.${action}`, { name: name ?? id }).toString());
      this.$emit('refresh');
    },
  },
});
</script>

<style lang="scss" scoped></style>
