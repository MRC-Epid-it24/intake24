export interface CsvColumnStructure {
  [key: string]: {
    type: string;
    header: string;
    required: boolean;
  };
}

export interface CsvRecordStructure {
  [key: string]: {
    header: string;
    type: string;
    required: boolean;
  };
}

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

type GenerateTypeFromPropertyWithRequired<T> = {
  [K in keyof T]: string;
};

type EnforceCsvRecordStructure<T> = {
  [P in keyof T]: T[P] extends { type: string; required: boolean } ? T[P] : never;
};

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

type CsvFoodRecordType = EnforceCsvRecordStructure<typeof CsvFoodRecords>;

export type CSVHeaders = CsvFoodRecordType[keyof CsvFoodRecordType]['header'];

export type CSVFields = GenerateTypeFromPropertyWithRequired<CsvFoodRecordType>;

export type CSVRequiredFields = Pick<
  CSVFields,
  {
    [K in keyof CSVFields]: CsvFoodRecordType[K] extends { required: true } ? K : never;
  }[keyof CSVFields]
>;

export type CSVOptionalFields = Pick<
  CSVFields,
  {
    [K in keyof CSVFields]: CsvFoodRecordType[K] extends { required: false } ? K : never;
  }[keyof CSVFields]
>;
// Union of required fields (CSVRequiredFields) and optional fields (CSVFields)
export type CSVFieldsWithOptional = AtLeastOne<CSVOptionalFields> | CSVRequiredFields;

export type CsvFoodRecordUnprocessed = {
  [key in CSVHeaders]: string;
};
