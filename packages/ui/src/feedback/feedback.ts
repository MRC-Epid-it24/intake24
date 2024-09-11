import type { ComputedRef } from 'vue';
import { computed, ref } from 'vue';

import type { FeedbackSection } from '@intake24/common/feedback';
import type { FeedbackSchemeResponse } from '@intake24/common/types/http';
import type { FeedbackCardParameters, FeedbackDictionaries } from '@intake24/ui/feedback';
import { buildTopFoods } from '@intake24/ui/feedback';

export function useFeedback(scheme: ComputedRef<FeedbackSchemeResponse | undefined>) {
  const feedbackDicts = ref<FeedbackDictionaries | null>(null);
  const cards = ref<FeedbackCardParameters[]>([]);

  const topFoods = ref(buildTopFoods({ max: 0, colors: [], nutrientTypes: [] }, []));

  const showCards = computed(() => scheme.value?.sections.includes('cards') && cards.value.length);

  const showMeals = computed(() => {
    if (!scheme.value?.sections.includes('meals'))
      return false;

    return !!(scheme.value.meals.chart.nutrients.length || scheme.value.meals.table.fields.length);
  });

  const showRating = computed(() => scheme.value?.sections.includes('rating'));
  const showSubmissions = computed(() => scheme.value?.sections.includes('submissions'));

  const showTopFoods = computed(() => {
    if (!scheme.value?.sections.includes('topFoods'))
      return false;

    return !!topFoods.value.chartData.length;
  });

  const getSectionOrder = (section: FeedbackSection) => scheme.value?.sections.indexOf(section);

  return {
    feedbackDicts,
    cards,
    topFoods,
    showCards,
    showMeals,
    showTopFoods,
    showRating,
    showSubmissions,
    getSectionOrder,
  };
}
