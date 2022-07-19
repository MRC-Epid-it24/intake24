<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.nutrients.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <add-nutrient-dialog
        :currentList="records"
        :nutrientTables="nutrientTables"
        @add="add"
      ></add-nutrient-dialog>
    </v-toolbar>
    <v-list two-line>
      <v-list-item-group>
        <template v-for="(record, idx) in records">
          <v-list-item :key="record.id">
            <v-list-item-content>
              <v-list-item-title>
                {{ getNutrientTableName(record.nutrientTableId) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t('common.id') }}: {{ record.nutrientTableRecordId }} | {{ $t('common.name') }}:
                {{ record.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="error" icon @click="remove(record.id)">
                <v-icon>$delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="idx + 1 < records.length" :key="`div-${record.id}`"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import isEqual from 'lodash/isEqual';
import type { NutrientTableRecordAttributes } from '@intake24/common/types/models';
import type { Errors } from '@intake24/common/util';
import type { FoodDatabaseRefs } from '@intake24/common/types/http/admin';
import { AddNutrientDialog } from '.';

export default defineComponent({
  name: 'FoodCompositionList',

  components: { AddNutrientDialog },

  props: {
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

  data() {
    return {
      records: [...this.value],
    };
  },

  watch: {
    value(val: NutrientTableRecordAttributes[], oldVal: NutrientTableRecordAttributes[]) {
      if (isEqual(oldVal, val)) return;

      this.records = [...val];
    },
    records(val: NutrientTableRecordAttributes[], oldVal: NutrientTableRecordAttributes[]) {
      if (isEqual(oldVal, val)) return;

      this.$emit('input', [...val]);
    },
  },

  methods: {
    add(item: NutrientTableRecordAttributes) {
      this.records.push(item);
    },

    remove(id: string) {
      this.records = this.records.filter((records) => records.id !== id);
    },

    getNutrientTableName(id: string) {
      const table = this.nutrientTables.find((item) => item.id === id);

      return table?.description ?? this.$t('common.not.found');
    },
  },
});
</script>
