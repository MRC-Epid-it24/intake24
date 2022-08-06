<template>
  <div>
    <v-switch v-model="showGlobalName" :label="$t('fdbs.showGlobalName')" class="mt-0"> </v-switch>
    <v-treeview
      :active.sync="active"
      :items="items"
      :load-children="fetchCategoryContent"
      :open.sync="open"
      activatable
      color="secondary"
      dense
      transition
    >
      <template v-slot:prepend="{ item }">
        <v-icon v-if="!item.children">fa-drumstick-bite</v-icon>
      </template>
      <template v-slot:label="{ item }">
        <router-link
          :to="{
            name: `fdbs-${item.children ? 'categories' : 'foods'}`,
            params: { id: localeId, entryId: item.id },
          }"
          class="text-decoration-none"
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

export interface CategoryListEntryItem extends CategoryListEntry {
  children: (CategoryListEntryItem | FoodListEntry)[];
}

export default defineComponent({
  name: 'FoodExplorer',

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
      try {
        const {
          data: { categories, foods },
        } = await this.$http.get<CategoryContentsResponse>(
          `admin/fdbs/${this.localeId}/categories/${category.id}/contents`
        );

        category.children.push(...categories.map((item) => ({ ...item, children: [] })), ...foods);
      } catch (err) {
        //
      }
    },
  },
});
</script>
