<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.nutrients.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <add-nutrient-dialog
        v-if="!disabled"
        :current-items="items"
        :nutrient-tables="nutrientTables"
        @add="add"
      ></add-nutrient-dialog>
    </v-toolbar>
    <v-list two-line>
      <template v-for="(item, idx) in items">
        <v-list-item :key="item.id" link>
          <v-list-item-avatar>
            <v-icon>$nutrient-types</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ getNutrientTableName(item.nutrientTableId) }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ $t('common.id') }}: {{ item.nutrientTableRecordId }} | {{ $t('common.name') }}:
              {{ item.name }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="!disabled">
            <confirm-dialog
              color="error"
              icon
              icon-left="$delete"
              :label="$t('fdbs.nutrients.remove').toString()"
              @confirm="remove(item.id)"
            >
              {{ $t('common.action.confirm.delete', { name: item.name }) }}
            </confirm-dialog>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="idx + 1 < items.length" :key="`div-${item.id}`"></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';

import type { FoodDatabaseRefs } from '@intake24/common/types/http/admin';
import type { Errors } from '@intake24/common/util';
import type { NutrientTableRecordAttributes } from '@intake24/db';
import { ConfirmDialog } from '@intake24/ui';

import { AddNutrientDialog } from '.';

export default defineComponent({
  name: 'FoodCompositionList',

  components: { AddNutrientDialog, ConfirmDialog },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object as PropType<Errors>,
      required: true,
    },
    nutrientTables: {
      type: Array as PropType<FoodDatabaseRefs['nutrientTables']>,
      default: () => [],
    },
    value: {
      type: Array as PropType<NutrientTableRecordAttributes[]>,
      required: true,
    },
  },

  emits: ['input'],

  data() {
    return {
      items: [...this.value],
    };
  },

  watch: {
    value(val: NutrientTableRecordAttributes[]) {
      if (deepEqual(val, this.items)) return;

      this.items = [...val];
    },
    items(val: NutrientTableRecordAttributes[]) {
      if (deepEqual(val, this.value)) return;

      this.$emit('input', [...val]);
    },
  },

  methods: {
    add(item: NutrientTableRecordAttributes) {
      this.items.push(item);
    },

    remove(id: string) {
      this.items = this.items.filter((item) => item.id !== id);
    },

    getNutrientTableName(id: string) {
      const table = this.nutrientTables.find((item) => item.id === id);

      return table?.description ?? this.$t('common.not.found');
    },
  },
});
</script>
