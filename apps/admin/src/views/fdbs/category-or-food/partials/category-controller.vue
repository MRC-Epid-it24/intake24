<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.categories.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <load-category-dialog
        :localeId="localeId"
        :currentList="categories"
        @add="add"
      ></load-category-dialog>
    </v-toolbar>
    <v-list>
      <v-list-item-group>
        <template v-for="(category, idx) in categories">
          <v-list-item :key="category.code">
            <v-list-item-content>
              <v-list-item-title>{{ category.code }} | {{ category.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="error" icon @click="remove(category.code)">
                <v-icon>$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="idx + 1 < categories.length" :key="`div-${category.code}`"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import isEqual from 'lodash/isEqual';
import type { CategoryAttributes } from '@intake24/common/types/models';
import type { Errors } from '@intake24/common/util';
import LoadCategoryDialog from './add-category-dialog.vue';

export default defineComponent({
  name: 'CategoryController',

  components: { LoadCategoryDialog },

  props: {
    localeId: {
      type: String,
      required: true,
    },
    value: {
      type: Array as PropType<CategoryAttributes[]>,
      required: true,
    },
    errors: {
      type: Object as PropType<Errors>,
      required: true,
    },
  },

  data() {
    return {
      categories: [...this.value],
    };
  },

  watch: {
    value(val: CategoryAttributes[]) {
      this.categories = [...val];
    },
    categories(val: CategoryAttributes[], oldVal: CategoryAttributes[]) {
      if (isEqual(oldVal, val)) return;

      this.$emit('input', [...val]);
    },
  },

  methods: {
    add(items: any[]) {
      this.categories = [...this.categories, ...items];
    },

    remove(code: string) {
      this.categories = this.categories.filter((category) => category.code !== code);
    },
  },
});
</script>
