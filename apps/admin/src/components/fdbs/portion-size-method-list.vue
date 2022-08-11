<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.portionSizeMethods.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        class="mx-3"
        color="secondary"
        :title="$t('fdbs.portionSizeMethods.add')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-list-item :key="item.id" link>
          <v-list-item-avatar>
            <v-icon>fa-pizza-slice</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.description }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.method }} </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="!disabled">
            <v-btn
              icon
              :title="$t('fdbs.portionSizeMethods.edit')"
              @click.stop="edit({ item, index })"
            >
              <v-icon color="primary lighten-1">$edit</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action v-if="!disabled">
            <confirm-dialog
              :label="$t('fdbs.portionSizeMethods.remove').toString()"
              color="error"
              icon
              icon-left="$delete"
              @confirm="remove(index)"
            >
              {{ $t('common.action.confirm.delete', { name: item.description }) }}
            </confirm-dialog>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="index + 1 < items.length" :key="`div-${item.id}`"></v-divider>
      </template>
    </v-list>
    <portion-size-method-selector ref="selector" @save="save"></portion-size-method-selector>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent, ref } from 'vue';

import type { PortionSizeMethodAttributes } from '@intake24/common/types/models';
import type { Errors } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

import PortionSizeMethodSelector from './portion-size-method-selector.vue';

export type PortionSizeMethodEvent = {
  index: number;
  item: PortionSizeMethodAttributes;
};

export default defineComponent({
  name: 'PortionSizeMethodList',

  components: { ConfirmDialog, PortionSizeMethodSelector },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object as PropType<Errors>,
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<PortionSizeMethodAttributes[]>,
      required: true,
    },
  },

  setup(props) {
    const items = ref([...props.value]);
    const selector = ref<InstanceType<typeof PortionSizeMethodSelector>>();

    return { items, selector };
  },

  watch: {
    value(val: PortionSizeMethodAttributes[]) {
      if (isEqual(val, this.items)) return;

      this.items = [...val];
    },
    items(val: PortionSizeMethodAttributes[]) {
      if (isEqual(val, this.value)) return;

      this.$emit('input', [...val]);
    },
  },

  methods: {
    add() {
      this.selector?.add();
    },

    load(items: PortionSizeMethodAttributes[]) {
      this.items = [...items];
    },

    edit({ item, index }: PortionSizeMethodEvent) {
      this.selector?.edit(index, item);
    },

    save({ item, index }: PortionSizeMethodEvent) {
      if (index === -1) this.items.push(item);
      else this.items.splice(index, 1, item);
    },

    remove(index: number) {
      this.items.splice(index, 1);
    },

    update() {
      if (isEqual(this.items, this.value)) return;

      this.$emit('input', this.items);
    },
  },
});
</script>
