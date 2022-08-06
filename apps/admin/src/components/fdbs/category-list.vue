<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.categories.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <add-category-dialog
        v-if="!disabled"
        :localeId="localeId"
        :currentList="categories"
        @add="add"
      ></add-category-dialog>
    </v-toolbar>
    <v-list>
      <v-list-item-group>
        <template v-for="(category, idx) in categories">
          <v-list-item :key="category.code">
            <v-list-item-content>
              <v-list-item-title>{{ category.code }} | {{ category.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="!disabled">
              <v-btn color="error" icon @click="remove(category.code)">
                <v-icon>$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="idx + 1 < categories.length" :key="`div-${category.code}`"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { CategoryAttributes } from '@intake24/common/types/models';
import type { Errors } from '@intake24/common/util';

import { AddCategoryDialog } from '.';

export default defineComponent({
  name: 'CategoryList',

  components: { AddCategoryDialog },

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
      categories: [...this.value],
    };
  },

  watch: {
    value(val: CategoryAttributes[]) {
      if (isEqual(this.categories, this.value)) return;

      this.records = [...val];
    },
    categories(val: CategoryAttributes[]) {
      if (isEqual(this.categories, this.value)) return;

      this.$emit('input', [...val]);
    },
  },

  methods: {
    add(items: CategoryAttributes[]) {
      this.categories.push(...items);
    },

    remove(code: string) {
      this.categories = this.categories.filter((category) => category.code !== code);
    },
  },
});
</script>
