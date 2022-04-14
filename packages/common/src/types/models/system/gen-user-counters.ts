export type GenUserCounterAttributes = {
  surveyId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GenUserCounterCreationAttributes = Omit<
  GenUserCounterAttributes,
  'createdAt' | 'updatedAt'
>;
