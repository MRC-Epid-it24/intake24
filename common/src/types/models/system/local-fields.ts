export type LocalFieldAttributes = {
  id: number;
  localeId: string;
  fieldName: string;
  description: string;
};

export type LocalFieldCreationAttributes = Omit<LocalFieldAttributes, 'id'>;
