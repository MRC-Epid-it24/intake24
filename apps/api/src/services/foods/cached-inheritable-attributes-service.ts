import type { IoC } from '@intake24/api/ioc';
import type { InheritableAttributes } from '@intake24/api/services/foods/types/inheritable-attributes';

const cachedInheritableAttributesService = ({
  inheritableAttributesService,
  cache,
  cacheConfig,
}: Pick<IoC, 'inheritableAttributesService' | 'cache' | 'cacheConfig'>) => {
  async function getData(foodCodes: string[]): Promise<Record<string, InheritableAttributes>> {
    const data = await Promise.all(
      foodCodes.map((code) => inheritableAttributesService.resolveInheritableAttributes(code))
    );

    return Object.fromEntries(foodCodes.map((code, index) => [code, data[index]]));
  }

  async function getInheritableAttributes(
    foodCodes: string[]
  ): Promise<Record<string, InheritableAttributes | null>> {
    return cache.rememberMany(foodCodes, 'attr', cacheConfig.ttl, getData);
  }

  return {
    getInheritableAttributes,
  };
};

export default cachedInheritableAttributesService;

export type CachedInheritableAttributesService = ReturnType<
  typeof cachedInheritableAttributesService
>;
