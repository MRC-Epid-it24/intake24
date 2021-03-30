import { Sequelize } from 'sequelize-typescript';
import { UserPortionSizeMethod } from '@/services/foods/types/user-portion-size-method';
import { FoodLocal } from '@/db/models/foods';

interface NewFood {
  code: string;
  description: string;
  foodGroupId: number;
}

interface NewFoodLocal {
  foodCode: string;
  localeId: string;
  name: string;
  simpleName: string;
  portionSizeMethods: UserPortionSizeMethod;
}

class FoodDataOps {
  private foodDatabase: Sequelize;

  constructor(foodDatabase: Sequelize) {
    this.foodDatabase = foodDatabase;
  }

  async createFoodLocals(foodLocals: NewFoodLocal[]): Promise<void> {
    const createAttribs = foodLocals.map((fl) => {
      return {
        foodCode: fl.foodCode,
        localeId: fl.localeId,
        name: fl.name,
        simpleName: fl.simpleName,
      };
    });

    await FoodLocal.bulkCreate(createAttribs);
  }
}
