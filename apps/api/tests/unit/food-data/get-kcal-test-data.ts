import {
  Food,
  FoodGroup,
  FoodLocal,
  FoodNutrient,
  NutrientTable,
  NutrientTableRecord,
  NutrientTableRecordNutrient,
  FoodsNutrientType,
  FoodsNutrientUnit,
  SequelizeTS,
} from '@intake24/db';

export default async (foodDatabase: SequelizeTS) => {
  await FoodsNutrientUnit.create({
    id: '1',
    description: 'Test unit',
    symbol: 'tu',
  });

  await FoodsNutrientType.create({
    id: '1',
    description: 'Energy (kcal)',
    unitId: '1',
  });

  await NutrientTable.create(
    {
      id: 'TEST',
      description: 'Test nutrient table',
      records: [
        {
          nutrientTableRecordId: 'TN1',
          name: 'Food A',
          localName: 'Food A',
          nutrients: [
            {
              nutrientTypeId: '1',
              unitsPer100g: 100,
            },
          ],
        },
      ],
    },
    {
      include: [
        {
          model: NutrientTableRecord,
          include: [NutrientTableRecordNutrient],
        },
      ],
    }
  );

  const { id: foodGroupId } = await FoodGroup.create({ name: 'Test food group' });

  await Food.create({
    code: 'FOOD1',
    name: 'Test food 1',
    foodGroupId,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await foodDatabase.transaction((t) =>
    FoodLocal.create(
      {
        foodCode: 'FOOD1',
        localeId: 'en_GB',
        name: 'Test food 1',
        simpleName: 'Test food 1',
        version: '00000000-0000-0000-0000-000000000000',
        nutrientMappings: [
          {
            nutrientTableRecordId: '1',
          },
        ],
      },
      {
        transaction: t,
        include: [FoodNutrient],
      }
    )
  );
};
