export type PhysicalActivityLevelAttributes = {
  id: string;
  name: string;
  coefficient: number;
};

export type PhysicalActivityLevelCreationAttributes = Omit<PhysicalActivityLevelAttributes, 'id'>;
