import { ref } from 'vue';

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { StandardUnitResponse } from '@intake24/common/types/http';
import { httpService } from '@intake24/survey/services';

export type StandardUnitRefs = Record<
  string,
  { estimateIn: RequiredLocaleTranslation; howMany: RequiredLocaleTranslation }
>;

export function useStandardUnits() {
  const standardUnitRefs = ref<StandardUnitRefs>({});

  const fetchStandardUnits = async (names: string[]) => {
    const { data } = await httpService.get<StandardUnitResponse[]>('portion-sizes/standard-units', {
      params: { id: names },
    });

    standardUnitRefs.value = data.reduce<StandardUnitRefs>((acc, unit) => {
      const { id, estimateIn, howMany } = unit;

      acc[id] = { estimateIn, howMany };

      return acc;
    }, {});
  };

  return { standardUnitRefs, fetchStandardUnits };
}
