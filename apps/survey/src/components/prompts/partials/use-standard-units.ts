import { computed, ref } from 'vue';

import type { StandardUnit } from '@intake24/common/surveys';
import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { StandardUnitResponse } from '@intake24/common/types/http';
import { useI18n } from '@intake24/i18n';
import { useHttp } from '@intake24/survey/services';

export type StandardUnitRefs = Record<
  string,
  { estimateIn: RequiredLocaleTranslation; howMany: RequiredLocaleTranslation }
>;

export function useStandardUnits() {
  const { translate } = useI18n();
  const http = useHttp();

  const standardUnitRefs = ref<StandardUnitRefs>({});
  const usingStandardTranslations = ref(true);

  const standardUnitsLoaded = computed(() => usingStandardTranslations.value ? !!Object.keys(standardUnitRefs.value).length : true);

  function getStandardUnitHowMany(item: StandardUnit) {
    return translate(item.inlineHowMany ?? standardUnitRefs.value[item.name]?.howMany ?? item.name);
  };

  function getStandardUnitEstimateIn(item: StandardUnit) {
    return translate(item.inlineEstimateIn ?? standardUnitRefs.value[item.name]?.estimateIn ?? item.name);
  };

  const resolveStandardUnits = async (names: string[]) => {
    if (!names.length) {
      usingStandardTranslations.value = false;
      return;
    }

    const { data } = await http.get<StandardUnitResponse[]>('portion-sizes/standard-units', {
      params: { id: names },
    });

    standardUnitRefs.value = data.reduce<StandardUnitRefs>((acc, unit) => {
      const { id, estimateIn, howMany } = unit;

      acc[id] = { estimateIn, howMany };

      return acc;
    }, {});
  };

  return {
    resolveStandardUnits,
    getStandardUnitHowMany,
    getStandardUnitEstimateIn,
    standardUnitRefs,
    standardUnitsLoaded,
  };
}
