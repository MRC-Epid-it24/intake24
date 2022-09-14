import { PopularityCounter } from '@intake24/db';

const popularitySearchService = () => {
  const ensureCountersExists = async (foodCodes: string[]) => {
    const foods = await PopularityCounter.findAll({
      attributes: ['foodCode'],
      where: { foodCode: foodCodes },
    });

    const existingFoodCodes = foods.map(({ foodCode }) => foodCode);
    const missingFoods = foodCodes.filter((foodCode) => !existingFoodCodes.includes(foodCode));

    await PopularityCounter.bulkCreate(missingFoods.map((foodCode) => ({ foodCode, counter: 0 })));
  };

  const updateCounters = async (foodCodes: string[]) => {
    const foodOccurrences = foodCodes.reduce<Record<string, number>>((acc, foodCode) => {
      acc[foodCode] ? acc[foodCode]++ : (acc[foodCode] = 1);
      return acc;
    }, {});

    await ensureCountersExists(foodCodes);

    await Promise.all(
      Object.entries(foodOccurrences).map(([foodCode, by]) =>
        PopularityCounter.increment('counter', { by, where: { foodCode } })
      )
    );
  };

  return { ensureCountersExists, updateCounters };
};

export default popularitySearchService;

export type PopularitySearchService = ReturnType<typeof popularitySearchService>;
