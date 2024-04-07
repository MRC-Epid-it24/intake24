import type { SetupContext } from 'vue';
import { ref, watch } from 'vue';

import type { ReviewOptions } from '@intake24/common/prompts';

export type UseReviewListProps = {
  review: ReviewOptions;
};

export function useReviewList(props: UseReviewListProps, ctx: SetupContext) {
  const bottomReached = ref(false);
  const reviewed = ref<string[]>([]);

  const bottomIntersect = (entries: IntersectionObserverEntry[]) => {
    if (!entries[0].isIntersecting)
      return;

    bottomReached.value = true;
    ctx.emit('bottom-reached', true);
  };

  watch(reviewed, (val) => {
    ctx.emit('reviewed', val);
  });

  return {
    bottomIntersect,
    bottomReached,
    reviewed,
  };
}
