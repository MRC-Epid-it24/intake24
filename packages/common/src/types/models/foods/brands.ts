export type BrandAttributes = {
  id: string;
  foodCode: string;
  localeId: string;
  name: string;
};

export type BrandCreationAttributes = Omit<BrandAttributes, 'id'>;
