<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded && refsLoaded">
    <v-card-title>{{ $t('nutrient-tables._') }}</v-card-title>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('common.id') }}</th>
          <td>{{ entry.id }}</td>
        </tr>
        <tr>
          <th>{{ $t('common.description') }}</th>
          <td>{{ entry.description }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-card-title>{{ $t('nutrient-tables.mapping.source._') }}</v-card-title>
    <v-simple-table>
      <tbody>
        <tr>
          <th>{{ $t('nutrient-tables.mapping.source.idColumnOffset') }}</th>
          <td>{{ offsetToExcelColumn(entry.csvMapping.idColumnOffset) }}</td>
        </tr>
        <tr>
          <th>{{ $t('nutrient-tables.mapping.source.descriptionColumnOffset') }}</th>
          <td>{{ offsetToExcelColumn(entry.csvMapping.descriptionColumnOffset) }}</td>
        </tr>
        <tr>
          <th>{{ $t('nutrient-tables.mapping.source.localDescriptionColumnOffset') }}</th>
          <td>{{ offsetToExcelColumn(entry.csvMapping.localDescriptionColumnOffset) }}</td>
        </tr>
        <tr>
          <th>{{ $t('nutrient-tables.mapping.source.rowOffset') }}</th>
          <td>{{ entry.csvMapping.rowOffset }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-card-title>{{ $t('nutrient-tables.mapping.fields._') }}</v-card-title>
    <v-simple-table>
      <thead>
        <tr>
          <th>{{ $t('nutrient-tables.mapping.fields.fieldName') }}</th>
          <th>{{ $t('nutrient-tables.mapping.fields.columnOffset') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="field in entry.csvMappingFields" :key="field.fieldName">
          <td>{{ field.fieldName }}</td>
          <td>{{ offsetToExcelColumn(field.columnOffset) }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-card-title>{{ $t('nutrient-tables.mapping.nutrients._') }}</v-card-title>
    <v-simple-table>
      <thead>
        <tr>
          <th>{{ $t('nutrient-tables.mapping.nutrients.nutrient') }}</th>
          <th>{{ $t('nutrient-tables.mapping.nutrients.columnOffset') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nutrient in entry.csvMappingNutrients" :key="nutrient.id">
          <td>{{ getNutrientName(nutrient.nutrientTypeId) }}</td>
          <td>{{ offsetToExcelColumn(nutrient.columnOffset) }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { NutrientTableEntry, NutrientTableRefs } from '@intake24/common/types/http/admin';
import { offsetToExcelColumn } from '@intake24/common/util';
import { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';

export default (
  Vue as VueConstructor<Vue & DetailMixin<NutrientTableEntry, NutrientTableRefs>>
).extend({
  name: 'NutrientTableDetail',

  mixins: [detailMixin],

  methods: {
    offsetToExcelColumn,

    getNutrientName(id: string): string {
      const match = this.refs.nutrientTypes.find((nutrient) => nutrient.id === id);

      return match?.description ?? id;
    },
  },
});
</script>

<style lang="scss" scoped></style>
