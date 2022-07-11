<template>
  <v-card>
    <v-card-title class="primary white--text text-h5"> FoodDB </v-card-title>
    <v-row class="pa-4" justify="space-between">
      <v-col cols="5" lg="4" xl="3">
        <v-treeview
          :active.sync="active"
          :items="items"
          :load-children="fetchCategoryContent"
          :open.sync="open"
          activatable
          color="secondary"
          dense
          item-text="name"
          transition
        >
          <template v-slot:prepend="{ item }">
            <v-icon v-if="!item.children">fa-drumstick-bite</v-icon>
          </template>
          <template v-slot:label="{ item }">
            <router-link
              :to="{
                name: `fdbs-${item.children ? 'categories' : 'foods'}`,
                params: { id, entryId: item.id },
              }"
              class="text-decoration-none"
            >
              {{ item.name }}
            </router-link>
          </template>
        </v-treeview>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-scroll-y-transition mode="out-in">
          <router-view></router-view>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type {
  CategoryContentsResponse,
  CategoryListEntry,
  FoodListEntry,
  RootCategoriesResponse,
} from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

export interface CategoryListEntryItem extends CategoryListEntry {
  children: (CategoryListEntryItem | FoodListEntry)[];
}

export default defineComponent({
  name: 'FoodDBDetail',

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      active: [] as string[],
      open: [] as string[],
      items: [] as CategoryListEntry[],
    };
  },

  async mounted() {
    await this.fetchRootCategories();
  },

  methods: {
    async fetchRootCategories() {
      const { data } = await this.$http.get<RootCategoriesResponse>(
        `admin/fdbs/${this.id}/categories/root`
      );

      const items = [
        {
          id: 'no-category',
          code: 'no-category',
          localeId: this.id,
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
          `admin/fdbs/${this.id}/categories/${category.id}/contents`
        );

        category.children.push(...categories.map((item) => ({ ...item, children: [] })), ...foods);
      } catch (err) {
        //
      }
    },
  },
});
</script>
