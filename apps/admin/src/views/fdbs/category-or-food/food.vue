<template>
  <div>
    <div v-if="isEntryLoaded">
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card border class="mb-6" flat>
          <v-toolbar color="grey-lighten-4">
            <v-toolbar-title class="font-weight-medium">
              {{ $t('fdbs.foods.local._') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="data.code"
                  :error-messages="errors.get('code')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.global.code')"
                  name="code"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="data.name"
                  :error-messages="errors.get('englishName')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.global.name')"
                  name="englishName"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="data.name"
                  :error-messages="errors.get('name')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.local.name')"
                  name="name"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <select-resource
                  v-model="data.foodGroupId"
                  :error-messages="errors.get('foodGroupId')"
                  :initial-item="entry?.foodGroup"
                  :label="$t('fdbs.foods.global.foodGroup')"
                  name="foodGroup"
                  resource="food-groups"
                  @update:model-value="errors.clear('foodGroupId')"
                />
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="data.tags"
                  chips
                  closable-chips
                  :error-messages="errors.get('tags')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.local.tags')"
                  multiple
                  name="tags"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="data.excludeTags"
                  chips
                  closable-chips
                  :error-messages="errors.get('excludeTags')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.local.excludeTags')"
                  multiple
                  name="excludeTags"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <category-list
          v-model="data.parentCategories"
          class="mb-6"
          :errors="errors"
          :locale-id="id"
          outlined
        />
        <nutrient-list
          v-model="data.nutrientRecords"
          class="mb-6"
          :errors="errors"
          :nutrient-tables="refs?.nutrientTables ?? []"
        />
        <portion-size-method-list
          v-model="data.portionSizeMethods"
          class="mb-6"
          :errors="errors"
          :locale-id="id"
        />
        <associated-food-list
          v-model="data.associatedFoods"
          class="mb-6"
          :errors="errors"
          :food-code="data.code"
          :locale-id="id"
        />
      </v-form>
      <div class="d-flex gc-2">
        <v-btn color="secondary" type="submit" variant="outlined" @click="submit">
          <v-icon icon="$save" start />{{ $t(`common.action.save`) }}
        </v-btn>
        <copy-entry-dialog v-bind="{ entryId, localeId: id, type }" />
        <v-spacer />
        <confirm-dialog
          color="error"
          icon-left="$delete"
          :label="$t('common.action.delete')"
          @confirm="remove"
        >
          {{ $t('common.action.confirm.delete', { name: entry?.name }) }}
        </confirm-dialog>
      </div>
    </div>
    <v-skeleton-loader
      v-else
      type="heading, list-item-three-line@3, actions"
    />
    <confirm-leave-dialog v-model="routeLeave" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';

import { SelectResource } from '@intake24/admin/components/dialogs';
import { ConfirmLeaveDialog } from '@intake24/admin/components/entry';
import {
  AssociatedFoodList,
  CategoryList,
  CopyEntryDialog,
  NutrientList,
  PortionSizeMethodList,
} from '@intake24/admin/components/fdbs';
import { useEntry, useEntryForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import type {
  FoodDatabaseRefs,
  FoodInput,
  FoodLocalEntry,
  LocaleEntry,
} from '@intake24/common/types/http/admin';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui/components';
import { useMessages } from '@intake24/ui/stores';

export default defineComponent({
  name: 'FoodEntry',

  components: {
    AssociatedFoodList,
    CategoryList,
    ConfirmDialog,
    ConfirmLeaveDialog,
    CopyEntryDialog,
    NutrientList,
    PortionSizeMethodList,
    SelectResource,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    entryId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const http = useHttp();
    const router = useRouter();
    const { i18n } = useI18n();

    const { entry: localeEntry } = useEntry<LocaleEntry>(props);

    const loading = ref(false);
    const type = 'foods' as const;
    const entry = ref<FoodLocalEntry | null>(null);
    const isEntryLoaded = computed(() => !!entry.value);

    const { refs } = useEntry<LocaleEntry, FoodDatabaseRefs>(props);
    const { clearError, form: { data, errors, put }, nonInputErrors, originalEntry, routeLeave, toForm } = useEntryForm<
      FoodInput,
      LocaleEntry
    >(props, {
      data: {
        code: '',
        englishName: '',
        name: '',
        foodGroupId: '0',
        locales: [],
        parentCategories: [],
        tags: [],
        excludeTags: [],
        nutrientRecords: [],
        portionSizeMethods: [],
        associatedFoods: [],
      },
      config: { extractNestedKeys: true },
    });

    const fetchCategoryOrFood = async (id: string, entryId: string) => {
      if (!entryId || entryId === 'no-category')
        return;

      loading.value = true;
      entry.value = null;

      try {
        const { data } = await http.get<FoodLocalEntry>(`admin/fdbs/${id}/${type}/${entryId}`);

        toForm(data);
        entry.value = data;
      }
      finally {
        loading.value = false;
      }
    };

    const submit = async () => {
      const data = await put<FoodLocalEntry>(`admin/fdbs/${props.id}/${type}/${props.entryId}`);
      toForm(data);

      const { name, main: { name: englishName = 'record' } = {} } = data;

      useMessages().success(i18n.t('common.msg.updated', { name: name ?? englishName }));
    };

    const remove = async () => {
      await http.delete(`admin/fdbs/${props.id}/${type}/${props.entryId}`);

      useMessages().success(
        i18n.t('common.msg.deleted', { name: entry.value?.main?.name }),
      );

      await router.push({
        name: `fdbs-categories`,
        params: {
          id: props.id,
          // @ts-expect-error missing typed locals
          entryId: entry.value?.main?.parentCategories?.at(0)?.locals?.at(0)?.id ?? 'no-category',
        },
      });
    };

    onMounted(async () => {
      await fetchCategoryOrFood(props.id, props.entryId);
    });

    onBeforeRouteUpdate(async (to, from, next) => {
      if (to.params.entryId !== from.params.entryId)
        await fetchCategoryOrFood(to.params.id.toString(), to.params.entryId.toString());

      next();
    });

    return {
      localeEntry,
      entry,
      refs,
      clearError,
      data,
      errors,
      nonInputErrors,
      originalEntry,
      routeLeave,
      toForm,
      isEntryLoaded,
      remove,
      submit,
      type,
    };
  },
});
</script>
