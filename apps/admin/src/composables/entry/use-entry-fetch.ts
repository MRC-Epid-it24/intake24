import { toRefs } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router/composables';

import { useEntry } from '@intake24/admin/stores';

import type { UseStoreEntryProps } from './use-entry';

export const useEntryFetch = (props: UseStoreEntryProps) => {
  const { id } = toRefs(props);

  const { requestEntry } = useEntry();
  const { meta: { action } = {} } = useRoute();

  const fetch = async (overrideId?: string) => {
    await requestEntry({ id: overrideId ?? id.value, action });
  };

  fetch();

  onBeforeRouteLeave(async (to, from, next) => {
    if (from.params.id === to.params.id) {
      next();
      return;
    }

    if (typeof to.params.id === 'string') await fetch(to.params.id);

    next();
  });

  return { fetch };
};
