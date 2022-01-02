<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-title>{{ $t('nutrient-tables._') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.id"
                :disabled="isEdit"
                :error-messages="form.errors.get('id')"
                :label="$t('common.id')"
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.description"
                :error-messages="form.errors.get('description')"
                :label="$t('common.description')"
                hide-details="auto"
                name="description"
                outlined
              ></v-text-field>
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
                :label="$t('nutrient-tables.mapping.source.idColumnOffset')"
                hide-details="auto"
                name="csvMapping.idColumnOffset"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.csvMapping.descriptionColumnOffset"
                :error-messages="form.errors.get('csvMapping.descriptionColumnOffset')"
                :label="$t('nutrient-tables.mapping.source.descriptionColumnOffset')"
                hide-details="auto"
                name="csvMapping.descriptionColumnOffset"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.csvMapping.localDescriptionColumnOffset"
                :error-messages="form.errors.get('csvMapping.localDescriptionColumnOffset')"
                :label="$t('nutrient-tables.mapping.source.localDescriptionColumnOffset')"
                hide-details="auto"
                name="csvMapping.localDescriptionColumnOffset"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.csvMapping.rowOffset"
                :error-messages="form.errors.get('csvMapping.rowOffset')"
                :label="$t('nutrient-tables.mapping.source.rowOffset')"
                hide-details="auto"
                name="csvMapping.rowOffset"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-toolbar flat tile>
          <v-toolbar-title>
            {{ $t('nutrient-tables.mapping.fields._') }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            :title="$t('nutrient-tables.mapping.fields.create')"
            color="secondary"
            outlined
            rounded
            @click.stop="addField"
          >
            <v-icon left>fa-plus</v-icon> {{ $t('nutrient-tables.mapping.fields.create') }}
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-alert v-if="form.errors.has('csvMappingFields')" border="left" outlined type="error">
            {{ form.errors.get('csvMappingFields') }}
          </v-alert>
          <v-simple-table>
            <thead>
              <tr>
                <th>{{ $t('nutrient-tables.mapping.fields.fieldName') }}</th>
                <th>{{ $t('nutrient-tables.mapping.fields.columnOffset') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, idx) in form.csvMappingFields" :key="`csv-mapping-fields-${idx}`">
                <td class="py-2">
                  <v-text-field
                    v-model="field.fieldName"
                    :label="$t('nutrient-tables.mapping.fields.fieldName')"
                    dense
                    hide-details="auto"
                    name="fieldName"
                    outlined
                  >
                  </v-text-field>
                </td>
                <td class="py-2">
                  <v-text-field
                    v-model="field.columnOffset"
                    :label="$t('nutrient-tables.mapping.fields.columnOffset')"
                    dense
                    hide-details="auto"
                    name="columnOffset"
                    outlined
                  >
                  </v-text-field>
                </td>
                <td class="py-2">
                  <v-btn
                    :title="$t('nutrient-tables.mapping.fields.delete')"
                    icon
                    @click="removeField(idx)"
                  >
                    <v-icon color="error">$delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-toolbar flat tile>
          <v-toolbar-title>
            {{ $t('nutrient-tables.mapping.nutrients._') }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            :title="$t('nutrient-tables.mapping.nutrients.create')"
            color="secondary"
            outlined
            rounded
            @click.stop="addNutrient"
          >
            <v-icon left>fa-plus</v-icon> {{ $t('nutrient-tables.mapping.nutrients.create') }}
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-alert
            v-if="form.errors.has('csvMappingNutrients')"
            border="left"
            outlined
            type="error"
          >
            {{ form.errors.get('csvMappingNutrients') }}
          </v-alert>
          <v-simple-table>
            <thead>
              <tr>
                <th>{{ $t('nutrient-tables.mapping.nutrients.nutrient') }}</th>
                <th>{{ $t('nutrient-tables.mapping.nutrients.columnOffset') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(nutrient, idx) in form.csvMappingNutrients"
                :key="`csv-mapping-nutrients-${idx}`"
              >
                <td class="py-2">
                  <v-select
                    v-model="nutrient.nutrientTypeId"
                    :items="refs.nutrients"
                    :label="$t('nutrient-tables.mapping.nutrients.nutrient')"
                    dense
                    item-value="id"
                    item-text="description"
                    hide-details="auto"
                    name="nutrient"
                    outlined
                  >
                  </v-select>
                </td>
                <td class="py-2">
                  <v-text-field
                    v-model="nutrient.columnOffset"
                    :label="$t('nutrient-tables.mapping.nutrients.columnOffset')"
                    dense
                    hide-details="auto"
                    name="columnOffset"
                    outlined
                  >
                  </v-text-field>
                </td>
                <td class="py-2">
                  <v-btn
                    :title="$t('nutrient-tables.mapping.nutrients.delete')"
                    icon
                    @click="removeNutrient(idx)"
                  >
                    <v-icon color="error">$delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { NutrientTableEntry, NutrientTableRefs } from '@common/types/http/admin';
import { excelColumnToOffset, offsetToExcelColumn } from '@common/util';
import formMixin from '@/components/entry/form-mixin';
import { form } from '@/helpers';
import { FormMixin } from '@/types';

export type NutrientTableForm = {
  id: string | null;
  description: string | null;
  csvMapping: {
    idColumnOffset: string;
    descriptionColumnOffset: string;
    localDescriptionColumnOffset: string | null;
    rowOffset: number;
  };
  csvMappingFields: { fieldName: string; columnOffset: string }[];
  csvMappingNutrients: { nutrientTypeId: string; columnOffset: string }[];
};

export const transformIn = (data: NutrientTableEntry) => {
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
};

export const transformOut = (data: NutrientTableForm) => {
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
      .filter((field) => field.fieldName && field.columnOffset)
      .map(({ fieldName, columnOffset }) => ({
        fieldName,
        columnOffset: excelColumnToOffset(columnOffset),
      })),
    csvMappingNutrients: csvMappingNutrients
      .filter((nutrient) => nutrient.nutrientTypeId && nutrient.columnOffset)
      .map(({ nutrientTypeId, columnOffset }) => ({
        nutrientTypeId,
        columnOffset: excelColumnToOffset(columnOffset),
      })),
  };
};

export default (
  Vue as VueConstructor<Vue & FormMixin<NutrientTableEntry, NutrientTableRefs>>
).extend({
  name: 'NutrientTableForm',

  mixins: [formMixin],

  data() {
    return {
      form: form<NutrientTableForm>(
        {
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
        { transform: transformOut }
      ),
    };
  },

  watch: {
    'form.csvMapping': {
      handler() {
        this.form.errors.clear('csvMapping');
      },
      deep: true,
    },
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
    toForm(data: NutrientTableEntry) {
      const input = transformIn(data);

      this.setOriginalEntry(input);
      this.form.load(input);
    },

    addField() {
      this.form.csvMappingFields.push({ fieldName: 'new_field', columnOffset: 'A' });
    },

    removeField(index: number) {
      this.form.csvMappingFields.splice(index, 1);
    },

    addNutrient() {
      this.form.csvMappingNutrients.push({
        nutrientTypeId: this.refs.nutrients[0].id,
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
