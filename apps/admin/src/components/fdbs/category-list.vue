<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.categories.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <add-category-dialog
        v-if="!disabled"
        :locale-id="localeId"
        :current-items="items"
        @add="add"
      ></add-category-dialog>
    </v-toolbar>
    <v-list>
      <template v-for="(item, idx) in items">
        <v-list-item :key="item.code" link>
          <v-list-item-avatar>
            <v-icon>fa-list</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.code }} | {{ item.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="!disabled">
            <confirm-dialog
              :label="$t('fdbs.categories.remove').toString()"
              color="error"
              icon
              icon-left="$delete"
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
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { CategoryAttributes } from '@intake24/common/types/models';
import type { Errors } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

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
      required: true,
    },
    localeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<CategoryAttributes[]>,
      required: true,
    },
  },

  data() {
    return {
      items: [...this.value],
    };
  },

  watch: {
    value(val: CategoryAttributes[]) {
      if (isEqual(val, this.items)) return;

      this.items = [...val];
    },
    items(val: CategoryAttributes[]) {
      if (isEqual(val, this.value)) return;

      this.$emit('input', [...val]);
    },
  },

  methods: {
    add(items: CategoryAttributes[]) {
      this.items.push(...items);
    },

    remove(code: string) {
      this.items = this.items.filter((item) => item.code !== code);
    },
  },
});
</script>
