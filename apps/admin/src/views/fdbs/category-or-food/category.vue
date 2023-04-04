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
          <v-icon left>$save</v-icon> {{ $t(`common.action.save`) }}
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
import { defineComponent } from 'vue';

import type { CategoryLocalEntry } from '@intake24/common/types/http/admin';
import { ConfirmLeaveDialog } from '@intake24/admin/components/entry';
import { createForm } from '@intake24/admin/util';

import categoryOrFood from './category-or-food';

export default defineComponent({
  name: 'CategoryEntry',

  components: { ConfirmLeaveDialog },

  mixins: [categoryOrFood],

  data() {
    return {
      type: 'categories',
      entry: null as CategoryLocalEntry | null,
      form: createForm(
        {
          name: null,
          main: {
            name: null,
            code: null,
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
        { extractNestedKeys: true }
      ),
    };
  },
});
</script>
