<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        <slot name="title">
          {{ $t('fdbs.categories.title') }}
        </slot>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <add-category-dialog
        v-if="!disabled"
        :current-items="items"
        :locale-id="localeId"
        @add="add"
      ></add-category-dialog>
    </v-toolbar>
    <v-list>
      <template v-for="(item, idx) in items">
        <v-list-item :key="item.code" link>
          <v-list-item-avatar>
            <v-icon>fas fa-list</v-icon>
          </v-list-item-avatar>
          <slot name="item.content" v-bind="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{ item.code }} | {{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </slot>
          <slot name="item.action" v-bind="{ item }"></slot>
          <v-list-item-action v-if="!disabled">
            <confirm-dialog
              color="error"
              icon
              icon-left="$delete"
              :label="$t('fdbs.categories.remove').toString()"
              @confirm="remove(item.code)"
            >
              {{ $t('common.action.confirm.delete', { name: item.name }) }}
            </confirm-dialog>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="idx + 1 < items.length" :key="`div-${item.code}`"></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';

import type { Errors } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

import type { CategoryListItem } from '.';
import { AddCategoryDialog } from '.';

export default defineComponent({
  name: 'CategoryList',

  components: { AddCategoryDialog, ConfirmDialog },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object as PropType<Errors>,
    },
    localeId: {
      type: String,
    },
    value: {
      type: Array as PropType<CategoryListItem[]>,
      required: true,
    },
  },

  emits: ['input'],

  data() {
    return {
      items: [...this.value],
    };
  },

  watch: {
    value(val: CategoryListItem[]) {
      if (deepEqual(val, this.items)) return;

      this.items = [...val];
    },
  },

  methods: {
    add(items: CategoryListItem[]) {
      this.items.push(...items);
      this.update();
    },

    remove(code: string) {
      this.items = this.items.filter((item) => item.code !== code);
      this.update();
    },

    update() {
      this.$emit('input', this.items);
    },
  },
});
</script>
