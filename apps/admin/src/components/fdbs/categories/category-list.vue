<template>
  <v-card v-bind="{ flat, outlined, tile }">
    <v-toolbar color="grey-lighten-4">
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
    <v-list class="list-border py-0">
      <v-list-item v-for="item in items" :key="item.code" link>
        <template #prepend>
          <v-icon>$categories</v-icon>
        </template>
        <slot name="item.content" v-bind="{ item }">
          <v-list-item-title>{{ item.code }} | {{ item.name }}</v-list-item-title>
        </slot>
        <template #append>
          <slot name="item.action" v-bind="{ item }" />
          <v-list-item-action v-if="!disabled">
            <confirm-dialog
              color="error"
              icon
              icon-left="$delete"
              :label="$t('fdbs.categories.remove')"
              @confirm="remove(item.code)"
            >
              {{ $t('common.action.confirm.remove', { name: item.name }) }}
            </confirm-dialog>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
    <v-messages
      v-if="errors?.has('main.parentCategories')"
      class="px-4 pb-2"
      color="error"
      :value="errors.get('main.parentCategories')"
    />
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { CategoryListItem } from './categories';
import { useVModel } from '@vueuse/core';

import { defineComponent } from 'vue';
import type { ReturnUseErrors } from '@intake24/admin/composables/use-errors';

import { ConfirmDialog } from '@intake24/ui';
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
      type: Object as PropType<ReturnUseErrors>,
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
    modelValue: {
      type: Array as PropType<CategoryListItem[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const items = useVModel(props, 'modelValue', emit, {
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
