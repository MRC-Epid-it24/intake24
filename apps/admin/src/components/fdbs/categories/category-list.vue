<template>
  <v-card v-bind="{ flat, outlined, tile }">
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        <slot name="title">
          {{ $t('fdbs.categories.title') }}
        </slot>
      </v-toolbar-title>
      <v-spacer />
      <add-category-dialog
        v-if="!disabled"
        :current-items="items"
        :locale-id="localeId"
        @add="add"
      />
    </v-toolbar>
    <v-list class="py-0">
      <template v-for="(item, idx) in items">
        <v-list-item :key="item.code" link>
          <v-list-item-avatar>
            <v-icon>$categories</v-icon>
          </v-list-item-avatar>
          <slot name="item.content" v-bind="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{ item.code }} | {{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </slot>
          <slot name="item.action" v-bind="{ item }" />
          <v-list-item-action v-if="!disabled">
            <confirm-dialog
              color="error"
              icon
              icon-left="$delete"
              :label="$t('fdbs.categories.remove').toString()"
              @confirm="remove(item.code)"
            >
              {{ $t('common.action.confirm.remove', { name: item.name }) }}
            </confirm-dialog>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="idx + 1 < items.length" :key="`div-${item.code}`" />
      </template>
    </v-list>
    <v-messages
      v-if="errors.has('main.parentCategories')"
      class="px-4 pb-2"
      color="error"
      :value="errors.get('main.parentCategories')"
    />
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import { defineComponent } from 'vue';

import { Errors } from '@intake24/common/util';
import { ConfirmDialog } from '@intake24/ui';

import type { CategoryListItem } from './categories';
import AddCategoryDialog from './add-category-dialog.vue';

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
      default: () => new Errors(),
    },
    flat: {
      type: Boolean,
    },
    localeId: {
      type: String,
    },
    outlined: {
      type: Boolean,
    },
    tile: {
      type: Boolean,
    },
    value: {
      type: Array as PropType<CategoryListItem[]>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const items = useVModel(props, 'value', emit, {
      eventName: 'input',
      passive: true,
      deep: true,
    });

    const add = (categories: CategoryListItem[]) => {
      items.value.push(...categories);
    };

    const remove = (code: string) => {
      items.value = items.value.filter(item => item.code !== code);
    };

    return { add, items, remove };
  },
});
</script>
