export type BrandAttributes = {
  id: number;
  foodCode: string;
  localeId: string;
  name: string;
};

export type BrandCreationAttributes = Omit<BrandAttributes, 'id'>;
