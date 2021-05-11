/*
Category structure for getFoodData tests:

CAT1 (portionSizeMethods[1] in en_GB)
|- FOOD1 (portionSizeMethods[0] in en_GB)
|- FOOD2 (no portion size methods in en_GB)
CAT2 (no portion size methods in en_GB)
|- CAT3 (portionSizeMethods[2] in en_GB)
   |- FOOD3 (no portion size methods in en_GB)
   CAT4 (portionSizeMethods[3] in en_GB)
   |- FOOD3 (no portion size methods in en_GB)
|-CAT5 (portionSizeMethods[4] in en_GB)
  |-CAT6 (no portion size methods in en_GB)
    |- FOOD4 (no portion size methods in en_GB)
|-CAT7 (no portion size methods in en_GB)
  |-CAT8 (no portion size methods in en_GB)
    |- FOOD5 (no portion size methods in en_GB, portionSizeMethods[5] in en_AU)
 */

import {
  Category,
  CategoryCategory,
  CategoryPortionSizeMethod,
  CategoryPortionSizeMethodParameter,
  Food,
  FoodCategory,
  FoodLocal,
  PortionSizeMethod,
  PortionSizeMethodParameter,
} from '@/db/models/foods';
import * as faker from 'faker';

import { Sequelize } from 'sequelize-typescript';
import {
  UserPortionSizeMethod,
  UserPortionSizeMethodParameters,
} from '@common/types/http/foods/user-food-data';
import {
  toDatabasePortionSizeMethod,
  toDatabasePortionSizeMethodParameters,
} from '@/services/foods/types/portion-size-method-utils';
import createLocales from './test-data-locales';

// TODO: use actual portion size method IDs and parameters.
// Random words are okay for now but could potentially cause weird issues like using
// reserved property names ('prototype' etc.)
function generateRandomPortionSizeMethods(count: number): UserPortionSizeMethod[] {
  const result: UserPortionSizeMethod[] = [];

  for (let i = 0; i < count; ++i) {
    const paramCount = faker.datatype.number(5);
    const parameters: UserPortionSizeMethodParameters = {};

    for (let j = 0; j < paramCount; ++j) {
      parameters[faker.random.word()] = faker.random.word();
    }

    result.push({
      conversionFactor: faker.datatype.float({ min: 0.1, max: 10, precision: 2 }),
      description: faker.random.words(5),
      imageUrl: faker.internet.url(),
      method: 'as-served',
      useForRecipes: false,
      parameters,
    });
  }

  return result;
}

function generateRandomPortionSizeMethodSets(count: number): UserPortionSizeMethod[][] {
  const result: UserPortionSizeMethod[][] = [];

  for (let i = 0; i < count; ++i) {
    result.push(generateRandomPortionSizeMethods(faker.datatype.number({ min: 1, max: 5 })));
  }

  return result;
}

export const generatedPortionSizeMethods: UserPortionSizeMethod[][] =
  generateRandomPortionSizeMethodSets(10);

async function createCategoryPortionSizeMethods(
  categoryCode: string,
  localeId: string,
  portionSizeMethods: UserPortionSizeMethod[]
): Promise<void> {
  for (let i = 0; i < portionSizeMethods.length; i++) {
    const catPsm = new CategoryPortionSizeMethod(
      {
        categoryCode,
        localeId,
        method: portionSizeMethods[i].method,
        description: portionSizeMethods[i].description,
        imageUrl: portionSizeMethods[i].imageUrl,
        useForRecipes: portionSizeMethods[i].useForRecipes,
        conversionFactor: portionSizeMethods[i].conversionFactor,
        parameters: toDatabasePortionSizeMethodParameters(portionSizeMethods[i].parameters),
      },
      {
        include: [CategoryPortionSizeMethodParameter],
      }
    );

    await catPsm.save();
  }
}

async function createCategories(): Promise<void> {
  const cat1 = new Category({
    code: 'CAT1',
    description: 'Test category 1',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await cat1.save();

  await createCategoryPortionSizeMethods('CAT1', 'en_GB', generatedPortionSizeMethods[1]);

  const cat2 = new Category({
    code: 'CAT2',
    description: 'Test category 2',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await cat2.save();

  const cat3 = new Category({
    code: 'CAT3',
    description: 'Test category 3',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await cat3.save();

  await createCategoryPortionSizeMethods('CAT3', 'en_GB', generatedPortionSizeMethods[2]);

  const cat4 = new Category({
    code: 'CAT4',
    description: 'Test category 4',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await cat4.save();

  await createCategoryPortionSizeMethods('CAT4', 'en_GB', generatedPortionSizeMethods[3]);

  await new CategoryCategory({
    categoryCode: 'CAT2',
    subcategoryCode: 'CAT3',
  }).save();

  await new CategoryCategory({
    categoryCode: 'CAT2',
    subcategoryCode: 'CAT4',
  }).save();

  await new Category({
    code: 'CAT5',
    description: 'Test category 5',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  }).save();

  await createCategoryPortionSizeMethods('CAT5', 'en_GB', generatedPortionSizeMethods[4]);

  await new Category({
    code: 'CAT6',
    description: 'Test category 6',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  }).save();

  await new CategoryCategory({
    categoryCode: 'CAT5',
    subcategoryCode: 'CAT6',
  }).save();

  await Category.create({
    code: 'CAT7',
    description: 'Test category 7',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await Category.create({
    code: 'CAT8',
    description: 'Test category 8',
    isHidden: false,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await CategoryCategory.create({
    categoryCode: 'CAT7',
    subcategoryCode: 'CAT8',
  });
}

async function createFoods(sequelize: Sequelize): Promise<void> {
  const food1 = new Food({
    code: 'FOOD1',
    description: 'Test food 1',
    foodGroupId: 1,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await food1.save();

  await sequelize.transaction((t) =>
    FoodLocal.create(
      {
        foodCode: 'FOOD1',
        localeId: 'en_GB',
        name: 'Test food 1',
        simpleName: 'Test food 1',
        version: '00000000-0000-0000-0000-000000000000',
        portionSizeMethods: generatedPortionSizeMethods[0].map(toDatabasePortionSizeMethod),
      },
      {
        transaction: t,
        include: [{ model: PortionSizeMethod, include: [PortionSizeMethodParameter] }],
      }
    )
  );

  const foodCategory1 = new FoodCategory({
    foodCode: 'FOOD1',
    categoryCode: 'CAT1',
  });

  await foodCategory1.save();

  const food2 = new Food({
    code: 'FOOD2',
    description: 'Test food 2',
    foodGroupId: 1,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await food2.save();

  const foodLocal2 = new FoodLocal({
    foodCode: 'FOOD2',
    localeId: 'en_GB',
    name: 'Test food 2',
    simpleName: 'Test food 2',
    version: '00000000-0000-0000-0000-000000000000',
  });

  await foodLocal2.save();

  const foodCategory2 = new FoodCategory({
    foodCode: 'FOOD2',
    categoryCode: 'CAT1',
  });

  await foodCategory2.save();

  const food3 = new Food({
    code: 'FOOD3',
    description: 'Test food 3',
    foodGroupId: 1,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await food3.save();

  await foodLocal2.save();

  await new FoodCategory({
    foodCode: 'FOOD3',
    categoryCode: 'CAT3',
  }).save();

  await new FoodCategory({
    foodCode: 'FOOD3',
    categoryCode: 'CAT4',
  }).save();

  await new Food({
    code: 'FOOD4',
    description: 'Test food 4',
    foodGroupId: 1,
    version: '00000000-0000-0000-0000-000000000000',
  }).save();

  await new FoodCategory({
    foodCode: 'FOOD4',
    categoryCode: 'CAT6',
  }).save();

  await Food.create({
    code: 'FOOD5',
    description: 'Test food 5',
    foodGroupId: 1,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await FoodCategory.create({
    foodCode: 'FOOD5',
    categoryCode: 'CAT8',
  });

  await sequelize.transaction((t) =>
    FoodLocal.create(
      {
        foodCode: 'FOOD5',
        localeId: 'en_AU',
        name: 'Test food 5 local name',
        simpleName: 'Test food 5 local name',
        version: '00000000-0000-0000-0000-000000000000',
        portionSizeMethods: generatedPortionSizeMethods[5].map(toDatabasePortionSizeMethod),
      },
      {
        transaction: t,
        include: [{ model: PortionSizeMethod, include: [PortionSizeMethodParameter] }],
      }
    )
  );
}

export async function createTestData(sequelize: Sequelize): Promise<void> {
  await createLocales();
  await createCategories();
  await createFoods(sequelize);
}
