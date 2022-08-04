export type SynonymSetsAttributes = {
  id: string;
  localeId: string;
  synonyms: string;
};

export type SynonymSetsCreationAttributes = Omit<SynonymSetsAttributes, 'id'>;
