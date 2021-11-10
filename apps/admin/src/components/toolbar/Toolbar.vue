<template>
  <v-card outlined class="mb-5">
    <v-toolbar>
      <template v-for="action in ['create', 'read', 'edit']">
        <component
          :is="action"
          v-if="currentActions.includes(action)"
          :action="action"
          :key="action"
          :disabled="selected.length !== 1"
          class="mr-2"
          @action="onAction"
        ></component>
      </template>
      <v-spacer></v-spacer>
      <confirm-dialog
        v-if="currentActions.includes('delete')"
        :disabled="!selected.length"
        :label="$t('common.action.delete')"
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
import Vue, { VueConstructor } from 'vue';
import { Location } from 'vue-router';
import upperFirst from 'lodash/upperFirst';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import Create from './Create.vue';
import Read from './Read.vue';
import Edit from './Edit.vue';

interface Actionable {
  [key: string]: () => Promise<void>;
}

export default (Vue as VueConstructor<Vue & Actionable>).extend({
  name: 'ToolBar',

  components: {
    ConfirmDialog,
    Create,
    Read,
    Edit,
  },

  props: {
    actions: {
      type: Array as () => string[],
      default: (): string[] => ['create', 'read', 'edit', 'delete'],
    },
    selected: {
      type: Array as () => (number | string)[],
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
    onAction(action: string) {
      this[`on${upperFirst(action)}`]();
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
      this.$toasted.success(this.$t('common.msg.multi.deleted').toString());
      this.onDraw();
    },

    getOneSelected() {
      if (this.selected.length !== 1) {
        this.$toasted.info(this.$t('Select one item to view/edit details.').toString());
        return false;
      }
      return this.selected[0];
    },

    getAtLeastOneSelected() {
      if (!this.selected.length) {
        this.$toasted.info(this.$t('Select at least one item.').toString());
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
