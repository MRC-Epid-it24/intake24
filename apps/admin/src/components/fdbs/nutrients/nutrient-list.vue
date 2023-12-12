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
    <v-list class="py-0" two-line>
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
              {{ $t('common.action.confirm.remove', { name: item.name }) }}
            </confirm-dialog>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="idx + 1 < items.length" :key="`div-${item.id}`"></v-divider>
      </template>
    </v-list>
    <v-messages
      v-if="errors.has('nutrientRecords')"
      class="px-4 pb-2"
      color="error"
      :value="errors.get('nutrientRecords')"
    ></v-messages>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { FoodDatabaseRefs } from '@intake24/common/types/http/admin';
import type { Errors } from '@intake24/common/util';
import type { NutrientTableRecordAttributes } from '@intake24/db';
import { useI18n } from '@intake24/i18n';
import { ConfirmDialog } from '@intake24/ui';

import AddNutrientDialog from './add-nutrient-dialog.vue';

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

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const items = computed({
      get() {
        return props.value;
      },
      set(val) {
        emit('input', val);
      },
    });

    const add = (item: NutrientTableRecordAttributes) => {
      items.value.push(item);
    };

    const remove = (id: string) => {
      items.value = items.value.filter((item) => item.id !== id);
    };

    const getNutrientTableName = (id: string) => {
      const table = props.nutrientTables.find((item) => item.id === id);

      return table?.description ?? i18n.t('common.not.found').toString();
    };

    return { add, getNutrientTableName, items, remove };
  },
});
</script>
