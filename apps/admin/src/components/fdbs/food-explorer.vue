<template>
  <div>
    <div class="d-flex flex-row justify-space-between">
      <div class="d-flex ga-2">
        <food-search v-bind="{ localeId }" />
        <add-food-dialog v-bind="{ localeId }" />
      </div>
      <v-menu :close-on-content-click="false" location="bottom left">
        <template #activator="{ props }">
          <v-btn color="primary" icon="$options" size="small" v-bind="props" />
        </template>
        <v-list>
          <v-list-item>
            <template #prepend>
              <v-list-item-action>
                <v-switch v-model="showGlobalName" />
              </v-list-item-action>
            </template>
            <v-list-item-title>{{ $t('fdbs.showGlobalName') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-divider class="my-3" />
    <v-treeview
      v-model:opened="opened"
      v-model:selected="selected"
      activatable
      color="primary"
      dense
      item-title="name"
      item-value="key"
      :items="items"
      :load-children="fetchCategoryContent"
      transition
    >
      <template #prepend="{ item }">
        <v-icon v-if="item.type === 'foods'" start>
          $foods
        </v-icon>
      </template>
      <template #title="{ item }">
        <a @click="openItem(item)">{{ item[itemText] }}</a>
      </template>
    </v-treeview>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

import { useHttp } from '@intake24/admin/services';
import type {
  CategoryContentsResponse,
  CategoryListEntry,
  FoodListEntry,
  RootCategoriesResponse,
} from '@intake24/common/types/http/admin';
import { randomString } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

import AddFoodDialog from './add-food-dialog.vue';
import FoodSearch from './food-search.vue';

export type TreeItem = ((CategoryListEntry & { children: TreeItem[] }) | FoodListEntry) & {
  key: string;
  type: string;
};

export default defineComponent({
  name: 'FoodExplorer',

  components: { AddFoodDialog, FoodSearch },

  props: {
    localeId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const http = useHttp();
    const { i18n } = useI18n();

    const selected = ref<string[]>([]);
    const opened = ref<string[]>([]);
    const items = ref<TreeItem[]>([]);
    const showGlobalName = ref<boolean>(false);
    const selectedEntryId = ref<string | null>(null);
    const selectedEntryCategories = ref<string[]>([]);

    const itemText = computed(() => (showGlobalName.value ? 'englishName' : 'name'));

    const fetchRootCategories = async () => {
      const { data } = await http.get<RootCategoriesResponse>(
        `admin/fdbs/${props.localeId}/categories/root`,
      );

      const noCategory: TreeItem = {
        key: randomString(8),
        type: 'categories',
        id: 'no-category',
        code: 'no-category',
        localeId: props.localeId,
        name: i18n.t('fdbs.categories.noCategory'),
        englishName: i18n.t('fdbs.categories.noCategory'),
        isHidden: false,
        children: [],
      };

      items.value = [
        noCategory,
        ...data.map(category => ({
          ...category,
          key: randomString(8),
          type: 'categories',
          children: [],
        })),
      ];
    };

    const fetchCategoryContent = async (category: TreeItem) => {
      const {
        data: { categories, foods },
      } = await http.get<CategoryContentsResponse>(
        `admin/fdbs/${props.localeId}/categories/${category.id}/contents`,
      );

      if (!('children' in category))
        return;

      category.children.push(
        ...categories.map(item => ({
          ...item,
          key: randomString(8),
          type: 'categories',
          children: [],
        })),
        ...foods.map(item => ({
          ...item,
          key: randomString(8),
          type: 'foods',
        })),
      );
    };

    const openItem = async (item: TreeItem) => {
      if (selectedEntryId.value === item.id)
        return;

      selectedEntryId.value = item.id;
      selectedEntryCategories.value = [];

      await router.push({
        name: `fdbs-${item.type}`,
        params: { id: props.localeId, entryId: item.id },
      });
    };

    const findActiveInChildren = async (children: TreeItem[]) => {
      if (!children.length)
        return;

      for (const child of children) {
        if (selectedEntryId.value === child.id) {
          selected.value = [child.key];
          return true;
        }

        if (selectedEntryCategories.value.includes(child.code)) {
          await fetchCategoryContent(child);
          opened.value.push(child.key);

          if (!('children' in child) || !child.children.length)
            continue;

          const found = await findActiveInChildren(child.children);
          if (found)
            return true;
        }
      }
    };

    const findActiveInTree = async (entryId: string, type: string) => {
      if (!['categories', 'foods'].includes(type))
        return;

      const { data } = await http.get<{ categories: string[] }>(
        `admin/fdbs/${props.localeId}/${type}/${entryId}/categories`,
      );

      selectedEntryId.value = entryId;
      selectedEntryCategories.value = data.categories.reverse();

      await findActiveInChildren(items.value);
    };

    onBeforeRouteUpdate((to, from, next) => {
      if (to.params.entryId !== selectedEntryId.value)
        findActiveInTree(to.params.entryId, to.meta?.module.current);

      next();
    });

    onMounted(async () => {
      await fetchRootCategories();
      await findActiveInTree(route.params.entryId, route.meta?.module.current);
    });

    return {
      fetchCategoryContent,
      items,
      itemText,
      opened,
      openItem,
      selected,
      showGlobalName,
      selectedEntryId,
      selectedEntryCategories,
    };
  },
});
</script>
