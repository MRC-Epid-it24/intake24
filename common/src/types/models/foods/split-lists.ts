export type SplitListAttributes = {
  id: string;
  localeId: string;
  firstWord: string;
  words: string;
};

export type SplitListCreationAttributes = Omit<SplitListAttributes, 'id'>;
