import type { LocaleMessageObject } from 'vue-i18n';

const nutrientTables: LocaleMessageObject = {
  _: 'Nutrient table',
  title: 'Nutrient tables',
  read: 'Nutrient table detail',
  create: 'Add nutrient table',
  edit: 'Edit nutrient table',
  delete: 'Delete nutrient table',
  id: 'Nutrient table ID',

  mapping: {
    source: {
      _: 'Source spreadsheet mapping',
      idColumnOffset: 'Record ID column',
      descriptionColumnOffset: 'Description column',
      localDescriptionColumnOffset: 'Local description column (leave blank if N/A)',
      rowOffset: 'Number of rows to skip (e.g. header or blank rows)',
    },
    fields: {
      _: 'Field column mappings',
      create: 'Add field',
      delete: 'Remove field',
      fieldName: 'Field name',
      columnOffset: 'CSV column',
    },
    nutrients: {
      _: 'Nutrient column mappings',
      create: 'Add nutrient',
      delete: 'Remove nutrient',
      nutrient: 'Nutrient',
      columnOffset: 'CSV column',
    },
  },

  upload: {
    _: 'Uploads',
    title: 'Nutrient table uploads',
    tab: 'Uploads',
    type: 'Data type upload',
  },
};

export default nutrientTables;
