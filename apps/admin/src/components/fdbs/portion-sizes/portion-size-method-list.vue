<template>
  <v-card border>
    <v-toolbar color="grey-lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.portionSizes.title') }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="!disabled"
        color="primary"
        icon="$add"
        size="small"
        :title="$t('fdbs.portionSizes.add')"
        @click.stop="add"
      />
    </v-toolbar>
    <v-list class="list-border py-0" lines="two">
      <vue-draggable
        v-model="items"
        :animation="300"
        handle=".drag-and-drop__handle"
      >
        <v-list-item v-for="(item, index) in items" :key="item._id">
          <template #prepend>
            <v-avatar class="drag-and-drop__handle" icon="$handle" />
          </template>
          <v-list-item-title>
            {{ $t(`prompts.portionSizeOption.selections.${item.description}`) }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ item.method }} </v-list-item-subtitle>
          <v-messages
            v-if="errors.has('portionSizeMethods', index)"
            color="error"
            :value="errors.get('portionSizeMethods', index)"
          />
          <template #append>
            <v-list-item-action v-if="!disabled">
              <v-btn icon="$edit" :title="$t('fdbs.portionSizes.edit')" @click.stop="edit({ item, index })" />
            </v-list-item-action>
            <v-list-item-action v-if="!disabled">
              <confirm-dialog
                color="error"
                icon
                icon-left="$delete"
                :label="$t('fdbs.portionSizes.remove')"
                @confirm="remove(index)"
              >
                {{ $t('common.action.confirm.remove', { name: item.description }) }}
              </confirm-dialog>
            </v-list-item-action>
          </template>
        </v-list-item>
      </vue-draggable>
    </v-list>
    <portion-size-method-selector ref="selector" @save="save" />
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

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

  components: { ConfirmDialog, PortionSizeMethodSelector, VueDraggable },

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
    modelValue: {
      type: Array as PropType<PortionSizeMethodItem[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const items = ref(props.modelValue.map(withIdAndOrder));
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
      if (deepEqual(val, this.outputItems))
        return;

      this.items = val.map(withIdAndOrder);
    },
    outputItems(val: PortionSizeMethodItem[]) {
      if (deepEqual(val, this.modelValue))
        return;

      this.$emit('update:modelValue', [...val]);
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
      if (index === -1)
        this.items.push(item);
      else this.items.splice(index, 1, item);
    },

    remove(index: number) {
      this.items.splice(index, 1);
    },
  },
});
</script>
