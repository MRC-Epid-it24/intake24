import type { Ref } from 'vue';
import chunk from 'lodash/chunk';
import { computed, ref } from 'vue';

import type { ImageMapResponse } from '@intake24/common/types/http';

export type UseImageMapProps = {
  imageMapData: ImageMapResponse;
  index?: number;
  labels: string[];
};

export const useImageMap = (props: UseImageMapProps, width: Ref<number>) => {
  const hoverIndex = ref<number | undefined>(undefined);

  const objects = computed(() =>
    props.imageMapData.objects.map((object) => ({
      id: object.id,
      polygon: chunk(
        object.outline.map((coord) => coord * width.value),
        2
      )
        .map((node) => node.join(','))
        .join(' '),
    }))
  );

  const label = computed(() => {
    if (!props.labels.length || (hoverIndex.value === undefined && props.index === undefined))
      return undefined;

    const idx = hoverIndex.value ?? props.index;
    if (idx === undefined) return undefined;

    return props.labels[idx];
  });

  return {
    hoverIndex,
    label,
    objects,
  };
};
