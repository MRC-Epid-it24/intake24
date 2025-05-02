<template>
  <div>
    <div v-if="isEntryLoaded" flat>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card border class="mb-6" flat>
          <v-toolbar color="grey-lighten-4">
            <v-toolbar-title class="font-weight-medium">
              {{ $t('fdbs.categories.local._') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="data.code"
                  :error-messages="errors.get('code')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.code')"
                  name="code"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="data.name"
                  :error-messages="errors.get('englishName')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.name')"
                  name="englishName"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="data.name"
                  :error-messages="errors.get('name')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.local.name')"
                  name="name"
                  variant="outlined"
                />
              </v-col>
              <v-col align-self="center" cols="12" md="6">
                <v-switch
                  v-model="data.hidden"
                  class="mt-0"
                  :error-messages="errors.get('hidden')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.hidden')"
                  name="hidden"
                  @update:model-value="errors.clear('hidden')"
                />
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="data.tags"
                  chips
                  closable-chips
                  :error-messages="errors.get('tags')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.local.tags')"
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
                  :label="$t('fdbs.categories.local.excludeTags')"
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
        <portion-size-method-list
          v-model="data.portionSizeMethods"
          class="mb-6"
          :errors="errors"
          :locale-id="id"
        />
      </v-form>
      <div class="d-flex gc-2">
        <v-btn color="secondary" variant="outlined" @click="submit">
          <v-icon icon="$save" start />{{ $t(`common.action.save`) }}
        </v-btn>
        <copy-entry-dialog v-bind="{ entryId, localeId: id, type }" />
        <v-spacer />
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
import { onBeforeRouteUpdate } from 'vue-router';

import { ConfirmLeaveDialog } from '@intake24/admin/components/entry';
import {
  CategoryList,
  CopyEntryDialog,
  PortionSizeMethodList,
} from '@intake24/admin/components/fdbs';
import { useEntry, useEntryForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import type {
  CategoryEntry,
  FoodDatabaseRefs,
  LocaleEntry,
} from '@intake24/common/types/http/admin';
import { useI18n } from '@intake24/i18n';
import { useMessages } from '@intake24/ui/stores';

export default defineComponent({
  name: 'CategoryEntry',

  components: {
    CategoryList,
    ConfirmLeaveDialog,
    CopyEntryDialog,
    PortionSizeMethodList,
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
    const { i18n } = useI18n();

    const { entry: localeEntry } = useEntry<LocaleEntry>(props);

    const loading = ref(false);
    const type = 'categories' as const;
    const entry = ref<CategoryEntry | null>(null);
    const isEntryLoaded = computed(() => !!entry.value);

    useEntry<LocaleEntry, FoodDatabaseRefs>(props);
    const { clearError, form: { data, errors, put }, nonInputErrors, originalEntry, routeLeave, toForm } = useEntryForm<
      any,
      LocaleEntry
    >(props, {
      data: {
        code: '',
        englishName: '',
        name: '',
        hidden: false,
        parentCategories: [],
        tags: [],
        excludeTags: [],
        portionSizeMethods: [],
      },
      config: { extractNestedKeys: true },
    });

    const fetchCategoryOrFood = async (id: string, entryId: string) => {
      if (!entryId || entryId === 'no-category')
        return;

      loading.value = true;
      entry.value = null;

      try {
        const { data } = await http.get<CategoryEntry>(
          `admin/fdbs/${props.id}/${type}/${entryId}`,
        );

        toForm(data);
        entry.value = data;
      }
      finally {
        loading.value = false;
      }
    };

    const submit = async () => {
      const data = await put<CategoryEntry>(
        `admin/fdbs/${props.id}/${type}/${props.entryId}`,
      );
      toForm(data);

      const { name, main: { name: englishName = 'record' } = {} } = data;

      useMessages().success(i18n.t('common.msg.updated', { name: name ?? englishName }));
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
      clearError,
      data,
      errors,
      nonInputErrors,
      originalEntry,
      routeLeave,
      toForm,
      isEntryLoaded,
      submit,
      type,
    };
  },
});
</script>
