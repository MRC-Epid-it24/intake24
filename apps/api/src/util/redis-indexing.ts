import ioc from '@intake24/api/ioc';

// Add a value to the redisSetService if needed IndexRebuilding
export const addToRedisSet = async (value: string) => {
  const redisIndexingProcessService = ioc.cradle.redisIndexingProcessService;
  redisIndexingProcessService.init();
  await redisIndexingProcessService.addToSet(value);
  redisIndexingProcessService.close();
};
