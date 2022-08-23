<template>
  <div>
    <v-card v-if="isEntryLoaded" flat>
      <v-form :disabled="disabled" @keydown.native="clearError" @submit.prevent="submit">
        <v-card class="mb-6" outlined>
          <v-toolbar color="grey lighten-4" flat>
            <v-toolbar-title class="font-weight-medium">
              {{ $t('fdbs.foods.global._') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.main.code"
                  :error-messages="form.errors.get('main.code')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.global.code')"
                  name="main.code"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.main.name"
                  :error-messages="form.errors.get('main.name')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.global.name')"
                  name="main.name"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <auto-complete
                  v-model="form.main.foodGroupId"
                  api="admin/food-groups"
                  :error-messages="form.errors.get('main.foodGroupId')"
                  :label="$t('fdbs.foods.global.foodGroup').toString()"
                  name="main.foodGroup"
                  response-object="data"
                  :selected="entry?.main?.foodGroup"
                  @input="form.errors.clear('main.foodGroupId')"
                ></auto-complete>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mb-6" outlined>
          <v-toolbar color="grey lighten-4" flat>
            <v-toolbar-title class="font-weight-medium">
              {{ $t('fdbs.foods.local._') }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  :error-messages="form.errors.get('name')"
                  hide-details="auto"
                  :label="$t('fdbs.foods.local.name')"
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
        <nutrient-list
          v-model="form.nutrientRecords"
          class="mb-6"
          :disabled="disabled"
          :errors="form.errors"
          :nutrient-tables="refs?.nutrientTables ?? []"
        ></nutrient-list>
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
        <v-btn color="primary" outlined type="submit" @click="submit">
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

import type { FoodLocalEntry } from '@intake24/common/types/http/admin';
import { ConfirmLeaveDialog } from '@intake24/admin/components/entry';
import { NutrientList } from '@intake24/admin/components/fdbs';
import { AutoComplete } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';

import categoryOrFood from './category-or-food';

export default defineComponent({
  name: 'FoodEntry',

  components: { AutoComplete, ConfirmLeaveDialog, NutrientList },

  mixins: [categoryOrFood],

  data() {
    return {
      type: 'foods',
      entry: null as FoodLocalEntry | null,
      form: form(
        {
          name: null,
          main: {
            name: null,
            code: null,
            foodGroupId: null,
            attributes: {
              readyMealOption: null,
              reasonableAmount: null,
              sameAsBeforeOption: null,
              useInRecipes: null,
            },
            parentCategories: [],
          },
          nutrientRecords: [],
          portionSizeMethods: [],
        },
        { extractNestedKeys: true }
      ),
    };
  },
});
</script>
