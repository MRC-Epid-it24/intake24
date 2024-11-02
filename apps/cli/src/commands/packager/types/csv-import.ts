export interface CsvResultStructure {
  [key: string]: string;
}

export interface DefaultPSMCategory {
  code: string;
  psm: string;
}

export const CsvFoodRecords = {
  intake24_code: {
    header: 'intake24 code',
    type: 'string',
    required: true,
  },
  english_description: {
    header: 'english description',
    type: 'string',
    required: true,
  },
  local_description: {
    header: 'local description',
    type: 'string',
    required: true,
  },
  foodCompositionTable: {
    header: 'food composition table',
    type: 'string',
    required: true,
  },
  foodCompositionRecordId: {
    header: 'food composition record id',
    type: 'string',
    required: true,
  },
  associatedFoodCategory: {
    header: 'associated food or category',
    type: 'string',
    required: false,
  },
  portionSizeEstimationMethods: {
    header: 'portion size estimation methods',
    type: 'string',
    required: true,
  },
  readyMealOption: {
    header: 'ready meal option',
    type: 'string',
    required: false,
  },
  sameAsBeforeOption: {
    header: 'same as before option',
    type: 'string',
    required: false,
  },
  reasonableAmount: {
    header: 'reasonable amount',
    type: 'string',
    required: false,
  },
  useInRecipes: {
    header: 'use in recipes',
    type: 'string',
    required: false,
  },
  brandNames: {
    header: 'brand names',
    type: 'string',
    required: false,
  },
  link: {
    header: 'link',
    type: 'string',
    required: false,
  },
  categories: {
    header: 'categories',
    type: 'string',
    required: false,
  },
  revisedLocalDescription: {
    header: 'revised local description',
    type: 'string',
    required: false,
  },
  action: {
    header: 'action',
    type: 'string',
    required: false,
  },
  milkInAHotDrink: {
    header: 'milk in a hot drink',
    type: 'string',
    required: false,
  },
} as const;

// Utility types
type CsvRecordType = typeof CsvFoodRecords;

type CSVHeaders = CsvRecordType[keyof CsvRecordType]['header'];

type RequiredHeaders = {
  [K in keyof CsvRecordType]: CsvRecordType[K]['required'] extends true
    ? CsvRecordType[K]['header']
    : never;
}[keyof CsvRecordType];

type OptionalHeaders = {
  [K in keyof CsvRecordType]: CsvRecordType[K]['required'] extends false
    ? CsvRecordType[K]['header']
    : never;
}[keyof CsvRecordType];

export type CSVRecord = Record<CSVHeaders, string>;
export type CSVRequiredFields = Record<RequiredHeaders, string>;
export type CSVOptionalFields = Record<OptionalHeaders, string>;

export type CSVFoodRecord = CSVRequiredFields & Partial<CSVOptionalFields>;
export type CsvFoodRecordUnprocessed = Record<CSVHeaders, string>;

export interface DefaultPSMCategory {
  code: string;
  psm: string;
}
