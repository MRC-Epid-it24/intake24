<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.portionSizes.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="mx-3"
        color="secondary"
        fab
        small
        :title="$t('fdbs.portionSizes.add')"
        @click.stop="add"
      >
        <v-icon small>$add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line>
      <draggable v-model="items" handle=".drag-and-drop__handle">
        <transition-group name="drag-and-drop" type="transition">
          <v-list-item
            v-for="(item, index) in items"
            :key="item._id"
            class="drag-and-drop__item"
            draggable
            link
          >
            <v-list-item-avatar class="drag-and-drop__handle">
              <v-icon>$handle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(`prompts.portionSizeOption.selections.${item.description}`) }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ item.method }} </v-list-item-subtitle>
              <v-messages
                v-if="errors.has('portionSizeMethods', index)"
                color="error"
                :value="errors.get('portionSizeMethods', index)"
              ></v-messages>
            </v-list-item-content>
            <v-list-item-action v-if="!disabled">
              <v-btn icon :title="$t('fdbs.portionSizes.edit')" @click.stop="edit({ item, index })">
                <v-icon color="primary lighten-1">$edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action v-if="!disabled">
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('fdbs.portionSizes.remove').toString()"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.delete', { name: item.description }) }}
              </confirm-dialog>
            </v-list-item-action>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>
    <portion-size-method-selector ref="selector" @save="save"></portion-size-method-selector>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';

import type { Errors } from '@intake24/common/util';
import { withIdAndOrder, withoutIdAndOrder } from '@intake24/admin/util';
import { ConfirmDialog } from '@intake24/ui';

import type {
  InternalPortionSizeMethodItem,
  PortionSizeMethodEvent,
  PortionSizeMethodItem,
} from './portion-sizes';
import PortionSizeMethodSelector from './portion-size-method-selector.vue';

export default defineComponent({
  name: 'PortionSizeMethodList',

  components: { ConfirmDialog, draggable, PortionSizeMethodSelector },

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
      type: Array as PropType<PortionSizeMethodItem[]>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props) {
    const items = ref(props.value.map(withIdAndOrder));
    const selector = ref<InstanceType<typeof PortionSizeMethodSelector>>();

    return { items, selector };
  },

  computed: {
    outputItems(): PortionSizeMethodItem[] {
      return this.items.map(withoutIdAndOrder);
    },
  },

  watch: {
    value(val: PortionSizeMethodItem[]) {
      if (deepEqual(val, this.outputItems)) return;

      this.items = val.map(withIdAndOrder);
    },
    outputItems(val: PortionSizeMethodItem[]) {
      if (deepEqual(val, this.value)) return;

      this.$emit('input', [...val]);
    },
  },

  methods: {
    add() {
      this.selector?.add();
    },

    load(items: InternalPortionSizeMethodItem[]) {
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
  },
});
</script>
