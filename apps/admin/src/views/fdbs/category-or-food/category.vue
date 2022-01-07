<template>
  <div>
    <v-card v-if="isEntryLoaded" flat>
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
                  :error-messages="form.errors.get('main.code')"
                  :label="$t('fdbs.categories.global.code')"
                  hide-details="auto"
                  name="main.code"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.main.name"
                  :error-messages="form.errors.get('main.name')"
                  :label="$t('fdbs.categories.global.name')"
                  hide-details="auto"
                  name="main.name"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" align-self="center">
                <v-switch
                  v-model="form.main.isHidden"
                  :error-messages="form.errors.get('main.isHidden')"
                  :label="$t('fdbs.categories.global.isHidden')"
                  class="mt-0"
                  hide-details="auto"
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
                  :label="$t('fdbs.categories.local.name')"
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
        <v-btn outlined color="primary" @click="submit"> <v-icon left>fa-save</v-icon>SAVE</v-btn>
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
import { CategoryLocalEntry } from '@common/types/http/admin';
import { form } from '@/helpers';
import categoryOrFood from './category-or-food';
import AttributeController from './partials/attribute-controller.vue';
import CategoryController from './partials/category-controller.vue';

type Mixins = InstanceType<typeof categoryOrFood>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'CategoryEntry',

  components: { AttributeController, CategoryController },

  mixins: [categoryOrFood],

  data() {
    return {
      type: 'categories',
      entry: null as CategoryLocalEntry | null,
      form: form(
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
            portionSizeMethods: [],
          },
        },
        { extractNestedKeys: true }
      ),
    };
  },
});
</script>
