export type SplitWordAttributes = {
  id: string;
  localeId: string;
  words: string;
};

export type SplitWordCreationAttributes = Omit<SplitWordAttributes, 'id'>;
