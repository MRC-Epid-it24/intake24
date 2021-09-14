import { NutrientTableRecordCreationAttributes } from './nutrient-table-records';

export type NutrientTableAttributes = {
  id: string;
  description: string;
};

export interface NutrientTableCreationAttributes extends NutrientTableAttributes {
  records?: Omit<NutrientTableRecordCreationAttributes, 'nutrientTableId'>[];
}
