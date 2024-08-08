<template>
  <div>
    <div v-if="isEntryLoaded" flat>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card class="mb-6" outlined>
          <v-toolbar color="grey lighten-4" flat>
            <v-toolbar-title class="font-weight-medium">
              {{ $t('fdbs.categories.global._') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.main.code"
                  :disabled="!globalEdit"
                  :error-messages="form.errors.get('main.code')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.code')"
                  name="main.code"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.main.name"
                  :disabled="!globalEdit"
                  :error-messages="form.errors.get('main.name')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.name')"
                  name="main.name"
                  outlined
                />
              </v-col>
              <v-col align-self="center" cols="12" md="6">
                <v-switch
                  v-model="form.main.isHidden"
                  class="mt-0"
                  :disabled="!globalEdit"
                  :error-messages="form.errors.get('main.isHidden')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.isHidden')"
                  name="main.isHidden"
                  @change="form.errors.clear('allowGenUsers')"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mb-6" outlined>
          <v-toolbar color="grey lighten-4" flat>
            <v-toolbar-title class="font-weight-medium">
              {{ $t('fdbs.categories.local._') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  :error-messages="form.errors.get('name')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.local.name')"
                  name="name"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="form.tags"
                  chips
                  closable-chips
                  :error-messages="form.errors.get('tags')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.local.tags')"
                  multiple
                  name="tags"
                  outlined
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <attribute-list
          v-model="form.main.attributes"
          class="mb-6"
          :disabled="!globalEdit"
          :errors="form.errors"
        />
        <category-list
          v-model="form.main.parentCategories"
          class="mb-6"
          :disabled="!globalEdit"
          :errors="form.errors"
          :locale-id="id"
          outlined
        />
        <portion-size-method-list
          v-model="form.portionSizeMethods"
          class="mb-6"
          :errors="form.errors"
          :locale-id="id"
        />
      </v-form>
      <div class="d-flex">
        <v-btn color="secondary" outlined @click="submit">
          <v-icon left>
            $save
          </v-icon>{{ $t(`common.action.save`) }}
        </v-btn>
        <copy-entry-dialog v-bind="{ entryId, localeId: id, type }" />
        <v-spacer />
      </div>
    </div>
    <v-skeleton-loader
      v-else
      type="card-heading, list-item-three-line@3, actions"
    />
    <confirm-leave-dialog v-model="routeLeave" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router/composables';

import type {
  CategoryLocalEntry,
  FoodDatabaseRefs,
  LocaleEntry,
} from '@intake24/common/types/http/admin';
import { ConfirmLeaveDialog } from '@intake24/admin/components/entry';
import {
  AttributeList,
  CategoryList,
  CopyEntryDialog,
  PortionSizeMethodList,
} from '@intake24/admin/components/fdbs';
import { useEntry, useEntryForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import { useUser } from '@intake24/admin/stores';
import { useI18n } from '@intake24/i18n';
import { useMessages } from '@intake24/ui/stores';

export default defineComponent({
  name: 'CategoryEntry',

  components: {
    AttributeList,
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
    const user = useUser();

    const { entry: localeEntry } = useEntry<LocaleEntry>(props);

    const loading = ref(false);
    const type = 'categories' as const;
    const entry = ref<CategoryLocalEntry | null>(null);
    const globalEdit = computed(() => user.can('locales|food-list'));
    const isEntryLoaded = computed(() => !!entry.value);

    useEntry<LocaleEntry, FoodDatabaseRefs>(props);
    const { clearError, form, nonInputErrors, originalEntry, routeLeave, toForm } = useEntryForm<
      any,
      LocaleEntry
    >(props, {
      data: {
        name: '',
        main: {
          name: '',
          code: '',
          isHidden: false,
          attributes: {
            readyMealOption: null,
            reasonableAmount: null,
            sameAsBeforeOption: null,
            useInRecipes: null,
          },
          parentCategories: [],
        },
        tags: [],
        portionSizeMethods: [],
      },
      config: { extractNestedKeys: true },
    });

    const fetchCategoryOrFood = async (entryId: string) => {
      if (!entryId || entryId === 'no-category')
        return;

      loading.value = true;
      entry.value = null;

      try {
        const { data } = await http.get<CategoryLocalEntry>(
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
      const data = await form.put<CategoryLocalEntry>(
        `admin/fdbs/${props.id}/${type}/${props.entryId}`,
      );
      toForm(data);

      const { name, main: { name: englishName = 'record' } = {} } = data;

      useMessages().success(i18n.t('common.msg.updated', { name: name ?? englishName }).toString());
    };

    onMounted(async () => {
      await fetchCategoryOrFood(props.entryId);
    });

    onBeforeRouteUpdate(async (to, from, next) => {
      if (to.params.entryId !== from.params.entryId)
        await fetchCategoryOrFood(to.params.entryId);

      next();
    });

    return {
      localeEntry,
      entry,
      clearError,
      form,
      nonInputErrors,
      originalEntry,
      routeLeave,
      toForm,
      globalEdit,
      isEntryLoaded,
      submit,
      type,
    };
  },
});
</script>
