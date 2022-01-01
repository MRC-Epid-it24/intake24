<template>
  <div>
    <v-card v-if="isEntryLoaded" flat>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
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
                  :label="$t('fdbs.foods.global.code')"
                  hide-details="auto"
                  name="main.code"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.main.name"
                  :error-messages="form.errors.get('main.name')"
                  :label="$t('fdbs.foods.global.name')"
                  hide-details="auto"
                  name="main.name"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <auto-complete
                  v-model="form.main.foodGroupId"
                  :error-messages="form.errors.get('main.foodGroupId')"
                  :selected="entry.main.foodGroup"
                  :label="$t('fdbs.foods.global.foodGroup')"
                  responseObject="data"
                  api="admin/food-groups"
                  name="main.foodGroup"
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
                  :label="$t('fdbs.foods.local.name')"
                  hide-details="auto"
                  name="name"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <attribute-controller
          v-model="form.main.attributes"
          :errors="form.errors"
          class="mb-6"
        ></attribute-controller>
        <category-controller
          v-model="form.main.parentCategories"
          :errors="form.errors"
          :localeId="id"
          class="mb-6"
        ></category-controller>
      </v-form>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="submit"> <v-icon left>fa-save</v-icon>SAVE </v-btn>
      </v-card-actions>
    </v-card>
    <v-skeleton-loader
      v-else
      type="card-heading, list-item-three-line@3, actions"
    ></v-skeleton-loader>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { FoodLocalEntry } from '@common/types/http/admin';
import { form } from '@/helpers';
import categoryOrFoodMixin from './category-or-food-mixin';
import AutoComplete from '@/components/forms/auto-complete.vue';
import AttributeController from './partials/attribute-controller.vue';
import CategoryController from './partials/category-controller.vue';

type Mixins = InstanceType<typeof categoryOrFoodMixin>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'FoodEntry',

  components: { AttributeController, AutoComplete, CategoryController },

  mixins: [categoryOrFoodMixin],

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
            portionSizeMethods: [],
          },
        },
        { extractNestedKeys: true }
      ),
    };
  },
});
</script>
