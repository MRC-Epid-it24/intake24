export type SynonymSetsAttributes = {
  id: string;
  localeId: string;
  synonyms: string;
};

export type SynonymSetsAttributesCreationAttributes = Omit<SynonymSetsAttributes, 'id'>;
