import type { IoC } from '@intake24/api/ioc';

// Add a value to the redisSetService if needed IndexRebuilding
export const addToRedisIndexingKeyCache = async (value: string, { cache }: Pick<IoC, 'cache'>) => {
  const redisIndexingProcessService = cache;
  const newValues: string[] = [value];
  if (value !== 'all') {
    const existingValues = await redisIndexingProcessService.get<string[]>('indexing-locales');
    if (existingValues && existingValues.length > 0) newValues.push(...existingValues);
  }
  await redisIndexingProcessService.set('indexing-locales', [...new Set(newValues)]);
};
