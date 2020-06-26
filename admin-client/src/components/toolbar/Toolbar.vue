<template>
  <v-card outlined class="my-5">
    <v-toolbar>
      <template v-for="action in ['create', 'detail', 'edit']">
        <component
          :is="action"
          v-if="actions.includes(action)"
          :action="action"
          :key="action"
          :disabled="selected.length !== 1"
          class="mr-2"
          @action="onAction"
        ></component>
      </template>
      <v-spacer></v-spacer>
      <template v-for="action in ['delete']">
        <component
          :is="action"
          v-if="actions.includes(action)"
          :action="action"
          :key="action"
          :disabled="!selected.length"
          class="mr-2"
          @action="onAction"
        ></component>
      </template>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { Location } from 'vue-router';
import upperFirst from 'lodash/upperFirst';
import Create from './Create.vue';
import Detail from './Detail.vue';
import Delete from './Delete.vue';
import Edit from './Edit.vue';

interface Actionable {
  [key: string]: () => Promise<void>;
}

export default (Vue as VueConstructor<Vue & Actionable>).extend({
  name: 'Toolbar',

  components: {
    Create,
    Delete,
    Detail,
    Edit,
  },

  props: {
    actions: {
      type: Array as () => string[],
      default: (): string[] => ['create', 'detail', 'edit', 'delete'],
    },
    selected: {
      type: Array,
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
    route(): string {
      return this.routePrefix ?? this.$route.name;
    },
  },

  methods: {
    onAction(action: string) {
      this[`on${upperFirst(action)}`]();
    },

    async onDetail() {
      const id = this.getOneSelected();
      if (id === false) return;

      await this.$router.push({ name: `${this.route}-detail`, params: { id } } as Location);
    },

    async onEdit() {
      const id = this.getOneSelected();
      if (id === false) return;

      await this.$router.push({ name: `${this.route}-edit`, params: { id } } as Location);
    },

    async onDelete() {
      const id = this.getAtLeastOneSelected();
      if (id === false) return;

      if (!confirm(this.$t('common.action.confirm.multi.delete', { count: id.length }) as string))
        return;

      await this.$http.delete(this.api, { params: { id } });
      this.$toasted.success(this.$t('common.msg.multi.deleted') as string);
      this.onDraw();
    },

    getOneSelected() {
      if (this.selected.length !== 1) {
        this.$toasted.info(this.$t('Select one item to view/edit details.') as string);
        return false;
      }
      return this.selected[0];
    },

    getAtLeastOneSelected() {
      if (!this.selected.length) {
        this.$toasted.info(this.$t('Select at least one item.') as string);
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
