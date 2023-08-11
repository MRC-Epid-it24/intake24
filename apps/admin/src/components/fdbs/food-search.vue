<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="1000px">
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" color="secondary" fab small :title="$t('fdbs.search._')" v-on="on">
        <v-icon>$search</v-icon>
      </v-btn>
    </template>
    <v-card :loading="loading" :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="primary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('fdbs.search.title') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-text-field
          v-model="search"
          append-icon="$search"
          class="mb-4"
          clearable
          hide-details="auto"
          :label="$t('common.search._')"
          :loading="loading"
          outlined
          @click:clear="clear"
        >
        </v-text-field>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="25"
          @click:row="selectItem"
        >
          <template #[`item.resource`]="{ item }">
            <v-icon>{{ `$${item.resource}` }}</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core';
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import type {
  CategoriesResponse,
  CategoryListEntry,
  FoodsResponse,
} from '@intake24/common/types/http/admin';
import { useHttp } from '@intake24/admin/services';
import { useI18n } from '@intake24/i18n';

export type Category = CategoryListEntry & { resource: 'categories' };
export type Food = FoodsResponse['data'][number] & { resource: 'foods' };

export type FoodSearchItem = Category | Food;

const props = defineProps({
  localeId: {
    type: String,
    required: true,
  },
});

const http = useHttp();
const { i18n } = useI18n();
const route = useRoute();
const router = useRouter();

const dialog = ref(false);
const loading = ref(false);
const search = ref('');

const categories = ref<CategoriesResponse['data']>([]);
const foods = ref<FoodsResponse['data']>([]);
const items = ref<FoodSearchItem[]>([]);

const headers = [
  { text: '', value: 'resource', sortable: false },
  { text: i18n.t('fdbs.foods.global.code'), value: 'code' },
  { text: i18n.t('fdbs.foods.global.name'), value: 'name' },
  { text: i18n.t('fdbs.foods.local.name'), value: 'englishName' },
];

const clear = async () => {
  search.value = '';
};

const close = () => {
  dialog.value = false;
};

const fetchCategories = async () => {
  const {
    data: { data },
  } = await http.get<CategoriesResponse>(`admin/fdbs/${props.localeId}/categories`, {
    params: { limit: 25, search: search.value },
  });

  categories.value = data;

  return data;
};

const fetchFoods = async () => {
  const {
    data: { data },
  } = await http.get<FoodsResponse>(`admin/fdbs/${props.localeId}/foods`, {
    params: { limit: 25, search: search.value },
  });

  foods.value = data;

  return data;
};

const fetchItems = async () => {
  loading.value = true;

  try {
    const [categories, foods] = await Promise.all([fetchCategories(), fetchFoods()]);

    //@ts-expect-error volar issue ?
    items.value = [
      ...categories.map((cat) => ({ ...cat, resource: 'categories' })),
      ...foods.map((food) => ({ ...food, resource: 'foods' })),
    ].sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    loading.value = false;
  }
};

const selectItem = async (item: FoodSearchItem) => {
  dialog.value = false;

  const name = `fdbs-${item.resource}`;
  const entryId = item.id;

  if (route.name === name && route.params.entryId === entryId) return;

  await router.push({
    name: `fdbs-${item.resource}`,
    params: { id: props.localeId, entryId: item.id },
  });
};

watchDebounced(
  search,
  async () => {
    await fetchItems();
  },
  { debounce: 500, maxWait: 2000 }
);
</script>

<script lang="ts">
export default defineComponent({
  name: 'FoodExplorer',
});
</script>

<style lang="scss">
.v-data-table tr {
  cursor: pointer;
}
</style>
```
