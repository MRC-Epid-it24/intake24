<template>
  <layout v-bind="{ id, entry }" v-model:route-leave="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown="clearError" @submit.prevent="submit">
        <v-card-title>{{ $t('nutrient-tables._') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                hide-details="auto"
                :label="$t('common.id')"
                name="id"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                hide-details="auto"
                :label="$t('common.description')"
                name="description"
                prepend-inner-icon="$description"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title>{{ $t('nutrient-tables.mapping.source._') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.csvMapping.idColumnOffset"
                :error-messages="form.errors.get('csvMapping.idColumnOffset')"
                hide-details="auto"
                :label="$t('nutrient-tables.mapping.source.idColumnOffset')"
                name="csvMapping.idColumnOffset"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.csvMapping.descriptionColumnOffset"
                :error-messages="form.errors.get('csvMapping.descriptionColumnOffset')"
                hide-details="auto"
                :label="$t('nutrient-tables.mapping.source.descriptionColumnOffset')"
                name="csvMapping.descriptionColumnOffset"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.csvMapping.localDescriptionColumnOffset"
                :error-messages="form.errors.get('csvMapping.localDescriptionColumnOffset')"
                hide-details="auto"
                :label="$t('nutrient-tables.mapping.source.localDescriptionColumnOffset')"
                name="csvMapping.localDescriptionColumnOffset"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.csvMapping.rowOffset"
                :error-messages="form.errors.get('csvMapping.rowOffset')"
                hide-details="auto"
                :label="$t('nutrient-tables.mapping.source.rowOffset')"
                name="csvMapping.rowOffset"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-toolbar flat tile>
          <v-toolbar-title>
            {{ $t('nutrient-tables.mapping.fields._') }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            color="primary"
            rounded
            :title="$t('nutrient-tables.mapping.fields.create')"
            variant="outlined"
            @click.stop="addField"
          >
            <v-icon icon="$add" start />{{ $t('nutrient-tables.mapping.fields.create') }}
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-alert v-if="form.errors.has('csvMappingFields')" border="start" type="error">
            {{ form.errors.get('csvMappingFields') }}
          </v-alert>
          <v-table>
            <thead>
              <tr>
                <th>{{ $t('nutrient-tables.mapping.fields.fieldName') }}</th>
                <th>{{ $t('nutrient-tables.mapping.fields.columnOffset') }}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, idx) in form.csvMappingFields" :key="`csv-mapping-fields-${idx}`">
                <td class="py-2">
                  <v-text-field
                    v-model="field.fieldName"
                    density="compact"
                    hide-details="auto"
                    :label="$t('nutrient-tables.mapping.fields.fieldName')"
                    name="fieldName"
                    variant="outlined"
                  />
                </td>
                <td class="py-2">
                  <v-text-field
                    v-model="field.columnOffset"
                    density="compact"
                    hide-details="auto"
                    :label="$t('nutrient-tables.mapping.fields.columnOffset')"
                    name="columnOffset"
                    variant="outlined"
                  />
                </td>
                <td class="py-2">
                  <v-btn
                    color="error"
                    icon="$delete"
                    :title="$t('nutrient-tables.mapping.fields.delete')"
                    variant="text"
                    @click="removeField(idx)"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-toolbar flat tile>
          <v-toolbar-title>
            {{ $t('nutrient-tables.mapping.nutrients._') }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            color="primary"
            rounded
            :title="$t('nutrient-tables.mapping.nutrients.create')"
            variant="outlined"
            @click.stop="addNutrient"
          >
            <v-icon icon="$add" start />{{ $t('nutrient-tables.mapping.nutrients.create') }}
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-alert
            v-if="form.errors.has('csvMappingNutrients')"
            border="start"
            type="error"
          >
            {{ form.errors.get('csvMappingNutrients') }}
          </v-alert>
          <v-table>
            <thead>
              <tr>
                <th>{{ $t('nutrient-tables.mapping.nutrients.nutrient') }}</th>
                <th>{{ $t('nutrient-tables.mapping.nutrients.columnOffset') }}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nutrient, idx) in nutrients.items" :key="`csv-mapping-nutrients-${idx}`">
                <td class="py-2">
                  <v-select
                    v-model="nutrient.nutrientTypeId"
                    density="compact"
                    hide-details="auto"
                    item-title="description"
                    item-value="id"
                    :items="refs.nutrientTypes"
                    :label="$t('nutrient-tables.mapping.nutrients.nutrient')"
                    name="nutrient"
                    variant="outlined"
                  />
                </td>
                <td class="py-2">
                  <v-text-field
                    v-model="nutrient.columnOffset"
                    density="compact"
                    hide-details="auto"
                    :label="$t('nutrient-tables.mapping.nutrients.columnOffset')"
                    name="columnOffset"
                    variant="outlined"
                  />
                </td>
                <td class="py-2">
                  <v-btn
                    color="error"
                    icon="$delete"
                    :title="$t('nutrient-tables.mapping.nutrients.delete')"
                    variant="text"
                    @click="removeNutrient(idx)"
                  />
                </td>
              </tr>
              <v-skeleton-loader
                v-if="nutrientsAvailableToLoad"
                v-intersect="loadMoreNutrients"
                type="table-row"
              />
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()" />
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { NutrientTableEntry, NutrientTableRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch, useEntryForm } from '@intake24/admin/composables';
import { excelColumnToOffset, offsetToExcelColumn } from '@intake24/common/util';

export type CsvMappingField = { fieldName: string; columnOffset: string };
export type CsvMappingNutrient = { nutrientTypeId: string; columnOffset: string };

export type NutrientTableForm = {
  id: string | null;
  description: string | null;
  csvMapping: {
    idColumnOffset: string;
    descriptionColumnOffset: string;
    localDescriptionColumnOffset: string | null;
    rowOffset: number;
  };
  csvMappingFields: CsvMappingField[];
  csvMappingNutrients: CsvMappingNutrient[];
};

export function transformIn(data: NutrientTableEntry) {
  const { csvMapping, csvMappingFields, csvMappingNutrients } = data;
  const { idColumnOffset, descriptionColumnOffset, localDescriptionColumnOffset } = csvMapping;

  return {
    ...data,
    csvMapping: {
      ...csvMapping,
      idColumnOffset: offsetToExcelColumn(idColumnOffset),
      descriptionColumnOffset: offsetToExcelColumn(descriptionColumnOffset),
      localDescriptionColumnOffset: offsetToExcelColumn(localDescriptionColumnOffset),
    },
    csvMappingFields: csvMappingFields.map(({ fieldName, columnOffset }) => ({
      fieldName,
      columnOffset: offsetToExcelColumn(columnOffset),
    })),
    csvMappingNutrients: csvMappingNutrients.map(({ nutrientTypeId, columnOffset }) => ({
      nutrientTypeId,
      columnOffset: offsetToExcelColumn(columnOffset),
    })),
  };
}

export function transformOut(data: NutrientTableForm) {
  const { csvMapping, csvMappingFields, csvMappingNutrients } = data;
  const { idColumnOffset, descriptionColumnOffset, localDescriptionColumnOffset } = csvMapping;

  return {
    ...data,
    csvMapping: {
      ...csvMapping,
      idColumnOffset: excelColumnToOffset(idColumnOffset),
      descriptionColumnOffset: excelColumnToOffset(descriptionColumnOffset),
      localDescriptionColumnOffset: localDescriptionColumnOffset
        ? excelColumnToOffset(localDescriptionColumnOffset)
        : null,
    },
    csvMappingFields: csvMappingFields
      .filter(field => field.fieldName && field.columnOffset)
      .map(({ fieldName, columnOffset }) => ({
        fieldName,
        columnOffset: excelColumnToOffset(columnOffset),
      })),
    csvMappingNutrients: csvMappingNutrients
      .filter(nutrient => nutrient.nutrientTypeId && nutrient.columnOffset)
      .map(({ nutrientTypeId, columnOffset }) => ({
        nutrientTypeId,
        columnOffset: excelColumnToOffset(columnOffset),
      })),
  };
}

export default defineComponent({
  name: 'NutrientTableForm',

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, isEdit, refs, refsLoaded } = useEntry<
      NutrientTableEntry,
      NutrientTableRefs
    >(props);
    useEntryFetch(props);
    const { clearError, form, routeLeave, submit } = useEntryForm<
      NutrientTableForm,
      NutrientTableEntry
    >(props, {
      data: {
        id: null,
        description: null,
        csvMapping: {
          idColumnOffset: 'A',
          descriptionColumnOffset: 'B',
          localDescriptionColumnOffset: null,
          rowOffset: 1,
        },
        csvMappingFields: [],
        csvMappingNutrients: [],
      },
      loadCallback: transformIn,
      config: { transform: transformOut },
    });

    return {
      entry,
      entryLoaded,
      isEdit,
      refs,
      refsLoaded,
      clearError,
      form,
      routeLeave,
      submit,
    };
  },

  data() {
    return {
      nutrients: {
        chunk: 10,
        items: [] as CsvMappingNutrient[],
      },
    };
  },

  computed: {
    nutrientsAvailableToLoad(): boolean {
      return this.nutrients.items.length < this.form.csvMappingNutrients.length;
    },
  },

  watch: {
    'form.csvMappingFields': {
      handler() {
        this.form.errors.clear('csvMappingFields');
      },
      deep: true,
    },
    'form.csvMappingNutrients': {
      handler() {
        this.form.errors.clear('csvMappingNutrients');
      },
      deep: true,
    },
  },

  methods: {
    loadMoreNutrients(isIntersecting: boolean, entries: IntersectionObserverEntry[]) {
      if (entries[0].isIntersecting && this.nutrientsAvailableToLoad) {
        const startIndex = this.nutrients.items.length;
        const endIndex
          = startIndex + this.nutrients.chunk > this.form.csvMappingNutrients.length
            ? this.form.csvMappingNutrients.length
            : startIndex + this.nutrients.chunk;

        const items = this.form.csvMappingNutrients.slice(startIndex, endIndex);
        this.nutrients.items.push(...items);
      }
    },

    addField() {
      this.form.csvMappingFields.push({ fieldName: 'new_field', columnOffset: 'A' });
    },

    removeField(index: number) {
      this.form.csvMappingFields.splice(index, 1);
    },

    addNutrient() {
      this.form.csvMappingNutrients.push({
        nutrientTypeId: this.refs.nutrientTypes[0].id,
        columnOffset: 'A',
      });
    },

    removeNutrient(index: number) {
      this.form.csvMappingNutrients.splice(index, 1);
    },
  },
});
</script>

<style lang="scss" scoped></style>
