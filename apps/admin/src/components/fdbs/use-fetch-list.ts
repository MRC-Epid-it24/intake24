import type { Ref } from 'vue';
import { unref, ref, watch } from 'vue';
import { httpService } from '@intake24/admin/services';
import debounce from 'lodash/debounce';

export const useFetchList = (url: string, id: string | Ref<string>) => {
  const dialog = ref(false);
  const loading = ref(false);
  const search = ref<string | null>(null);
  const items = ref<any[]>([]);

  const debouncedFetch = debounce(() => {
    fetch();
  }, 500);

  const fetch = async () => {
    loading.value = true;

    try {
      const {
        data: { data },
      } = await httpService.get(url.replace(':id', unref(id)), {
        params: { search: search.value, limit: 5 },
      });

      items.value = data;
    } finally {
      loading.value = false;
    }
  };

  const clear = async () => {
    search.value = null;
    await fetch();
  };

  watch(dialog, async (val) => {
    if (val && !items.value.length) await fetch();
  });

  watch(search, () => {
    debouncedFetch();
  });

  return {
    dialog,
    loading,
    search,
    items,
    fetch,
    clear,
  };
};
