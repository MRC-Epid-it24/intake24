<template>
  <div>
    <v-card v-if="isEntryLoaded" flat>
      <v-form :disabled="disabled" @keydown.native="clearError" @submit.prevent="submit">
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
                  :error-messages="form.errors.get('main.code')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.code')"
                  name="main.code"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.main.name"
                  :error-messages="form.errors.get('main.name')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.name')"
                  name="main.name"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col align-self="center" cols="12" md="6">
                <v-switch
                  v-model="form.main.isHidden"
                  class="mt-0"
                  :error-messages="form.errors.get('main.isHidden')"
                  hide-details="auto"
                  :label="$t('fdbs.categories.global.isHidden')"
                  name="main.isHidden"
                  @change="form.errors.clear('allowGenUsers')"
                ></v-switch>
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
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <attribute-list
          v-model="form.main.attributes"
          class="mb-6"
          :disabled="disabled"
          :errors="form.errors"
        ></attribute-list>
        <category-list
          v-model="form.main.parentCategories"
          class="mb-6"
          :disabled="disabled"
          :errors="form.errors"
          :locale-id="id"
        ></category-list>
        <portion-size-method-list
          v-model="form.portionSizeMethods"
          class="mb-6"
          :disabled="disabled"
          :errors="form.errors"
          :locale-id="id"
        ></portion-size-method-list>
      </v-form>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined @click="submit">
          <v-icon left>$save</v-icon>{{ $t(`common.action.save`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-skeleton-loader
      v-else
      type="card-heading, list-item-three-line@3, actions"
    ></v-skeleton-loader>
    <confirm-leave-dialog v-model="routeLeave"></confirm-leave-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router/composables';

import type {
  CategoryLocalEntry,
  FoodDatabaseEntry,
  FoodDatabaseRefs,
  LocaleEntry,
} from '@intake24/common/types/http/admin';
import { ConfirmLeaveDialog } from '@intake24/admin/components/entry';
import {
  AttributeList,
  CategoryList,
  PortionSizeMethodList,
} from '@intake24/admin/components/fdbs';
import { useEntry, useEntryForm } from '@intake24/admin/composables';
import { useHttp } from '@intake24/admin/services';
import { useUser } from '@intake24/admin/stores';
import { useI18n } from '@intake24/i18n';
import { useMessages } from '@intake24/ui/stores';

export default defineComponent({
  name: 'CategoryEntry',

  components: { AttributeList, CategoryList, ConfirmLeaveDialog, PortionSizeMethodList },

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
    const i18n = useI18n();
    const user = useUser();

    const { entry: localeEntry } = useEntry<LocaleEntry>(props);
    const disabled = computed(
      () =>
        !user.can({
          resource: 'locales',
          action: 'food-list',
          securables: localeEntry.value.securables,
          ownerId: localeEntry.value.ownerId,
        })
    );

    const loading = ref(false);
    const type = 'categories';
    const entry = ref<CategoryLocalEntry | null>(null);
    const isEntryLoaded = computed(() => !!entry.value);

    useEntry<FoodDatabaseEntry, FoodDatabaseRefs>(props);
    const { clearError, form, nonInputErrors, originalEntry, routeLeave, toForm } = useEntryForm<
      any,
      FoodDatabaseEntry
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
        portionSizeMethods: [],
      },
      config: { extractNestedKeys: true },
    });

    const fetchCategoryOrFood = async (entryId: string) => {
      if (!entryId || entryId === 'no-category') return;

      loading.value = true;
      entry.value = null;

      try {
        const { data } = await http.get<CategoryLocalEntry>(
          `admin/fdbs/${props.id}/${type}/${entryId}`
        );

        toForm(data);
        entry.value = data;
      } finally {
        loading.value = false;
      }
    };

    const submit = async () => {
      const data = await form.put<CategoryLocalEntry>(
        `admin/fdbs/${props.id}/${type}/${props.entryId}`
      );
      toForm(data);

      const { name, main: { name: englishName = 'record' } = {} } = data;

      useMessages().success(i18n.t('common.msg.updated', { name: name ?? englishName }).toString());
    };

    onMounted(async () => {
      await fetchCategoryOrFood(props.entryId);
    });

    onBeforeRouteUpdate(async (to, from, next) => {
      if (to.params.entryId !== from.params.entryId) {
        await fetchCategoryOrFood(to.params.entryId);
      }

      next();
    });

    return {
      clearError,
      form,
      nonInputErrors,
      originalEntry,
      routeLeave,
      toForm,
      disabled,
      isEntryLoaded,
      submit,
    };
  },
});
</script>
