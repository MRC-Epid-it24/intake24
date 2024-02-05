export interface CsvColumnStructure {
  [key: string]: {
    type: string;
    format: string;
    required: boolean;
    language_code?: string;
  };
}

export interface CsvResultStructure {
  [key: string]: string;
}
