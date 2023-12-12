<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" color="primary" rounded :title="$t('fdbs.foods.add')" v-on="on">
        <v-icon left>$add</v-icon> {{ $t('fdbs.foods.add') }}
      </v-btn>
    </template>
    <v-card :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="close">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('fdbs.foods.add') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form @keydown.native="clearError" @submit.prevent="confirm">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.code"
                :error-messages="form.errors.get('code')"
                hide-details="auto"
                :label="$t('fdbs.foods.global.code')"
                name="code"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('fdbs.foods.global.name')"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <select-resource
                v-model="form.foodGroupId"
                :error-messages="form.errors.get('foodGroupId')"
                :label="$t('fdbs.foods.global.foodGroup')"
                name="foodGroupId"
                resource="food-groups"
                @input="form.errors.clear('foodGroupId')"
              >
              </select-resource>
            </v-col>
            <v-col cols="12">
              <category-list
                v-model="form.parentCategories"
                class="mb-6"
                :errors="form.errors"
                :locale-id="localeId"
              ></category-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-btn class="font-weight-bold" color="error" text @click.stop="close">
          <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          class="font-weight-bold"
          color="info"
          :disabled="form.errors.any()"
          text
          @click.stop="confirm"
        >
          <v-icon left>$success</v-icon>{{ $t('common.action.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

import type { FoodInput, FoodLocalEntry } from '@intake24/common/types/http/admin';
import { SelectResource } from '@intake24/admin/components/dialogs';
import { useForm } from '@intake24/admin/composables';
import { useI18n } from '@intake24/i18n';
import { useMessages } from '@intake24/ui/stores';

import CategoryList from './categories/category-list.vue';

export type CreateFoodForm = Required<FoodInput>;

export default defineComponent({
  name: 'AddFoodDialog',

  components: { CategoryList, SelectResource },

  props: {
    localeId: {
      type: String,
      required: true,
    },
  },

  emits: ['add'],

  setup(props) {
    const { i18n } = useI18n();
    const router = useRouter();
    const dialog = ref(false);

    const { clearError, form } = useForm<CreateFoodForm>({
      data: { code: '', name: '', foodGroupId: '0', parentCategories: [] },
    });

    const close = () => {
      dialog.value = false;
    };

    const confirm = async () => {
      const { localeId } = props;
      const data = await form.post<FoodLocalEntry>(`admin/fdbs/${localeId}/foods`);

      const { id, name, main: { name: englishName = 'record' } = {} } = data;

      close();
      useMessages().success(i18n.t('common.msg.created', { name: name ?? englishName }).toString());
      await router.push({ name: `fdbs-foods`, params: { id: localeId, entryId: id } });
    };

    return { clearError, close, confirm, dialog, form };
  },
});
</script>
