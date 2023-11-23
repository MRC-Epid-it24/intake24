<template>
  <div>
    <div class="d-flex flex-row justify-space-between">
      <div class="d-flex ga-2">
        <food-search v-bind="{ localeId }"></food-search>
        <add-food-dialog v-bind="{ localeId }"></add-food-dialog>
      </div>
      <v-menu bottom :close-on-content-click="false" left :nudge-width="200" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" fab small v-bind="attrs" v-on="on">
            <v-icon>$options</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="showGlobalName"></v-switch>
            </v-list-item-action>
            <v-list-item-title>{{ $t('fdbs.showGlobalName') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-divider class="my-3"></v-divider>
    <v-treeview
      activatable
      :active.sync="active"
      color="primary"
      dense
      :items="items"
      :load-children="fetchCategoryContent"
      :open.sync="open"
      transition
    >
      <template #prepend="{ item }">
        <v-icon v-if="!item.children">$foods</v-icon>
      </template>
      <template #label="{ item }">
        <router-link
          class="text-decoration-none"
          :to="{
            name: `fdbs-${item.children ? 'categories' : 'foods'}`,
            params: { id: localeId, entryId: item.id },
          }"
        >
          {{ item[itemText] }}
        </router-link>
      </template>
    </v-treeview>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type {
  CategoryContentsResponse,
  CategoryListEntry,
  FoodListEntry,
  RootCategoriesResponse,
} from '@intake24/common/types/http/admin';

import AddFoodDialog from './add-food-dialog.vue';
import FoodSearch from './food-search.vue';

export interface CategoryListEntryItem extends CategoryListEntry {
  children: (CategoryListEntryItem | FoodListEntry)[];
}

export default defineComponent({
  name: 'FoodExplorer',

  components: { AddFoodDialog, FoodSearch },

  props: {
    localeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      active: [] as string[],
      open: [] as string[],
      items: [] as CategoryListEntry[],
      showGlobalName: false,
    };
  },

  computed: {
    itemText(): string {
      return this.showGlobalName ? 'englishName' : 'name';
    },
  },

  async mounted() {
    await this.fetchRootCategories();
  },

  methods: {
    async fetchRootCategories() {
      const { data } = await this.$http.get<RootCategoriesResponse>(
        `admin/fdbs/${this.localeId}/categories/root`
      );

      const items = [
        {
          id: 'no-category',
          code: 'no-category',
          localeId: this.localeId,
          name: this.$t('fdbs.categories.noCategory').toString(),
          englishName: this.$t('fdbs.categories.noCategory').toString(),
          isHidden: false,
          children: [],
        },
      ];

      this.items = [...items, ...data.map((category) => ({ ...category, children: [] }))];
    },

    async fetchCategoryContent(category: CategoryListEntryItem) {
      const {
        data: { categories, foods },
      } = await this.$http.get<CategoryContentsResponse>(
        `admin/fdbs/${this.localeId}/categories/${category.id}/contents`
      );

      category.children.push(...categories.map((item) => ({ ...item, children: [] })), ...foods);
    },
  },
});
</script>
