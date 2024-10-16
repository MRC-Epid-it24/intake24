import { computed } from 'vue';

import type { FeedbackCardParameters } from '@intake24/ui/feedback';

import { getDetails } from './card-details';

export type UseCardProps = {
  parameters: FeedbackCardParameters;
};

export function useCard(props: UseCardProps) {
  const detail = computed(() => getDetails[props.parameters.type](props.parameters));
  const backgroundImage = computed(() => props.parameters.image);

  const formatOutput = (value: number | string, unit: string): string => `${value} ${unit}`;

  return {
    detail,
    backgroundImage,
    getDetails,
    formatOutput,
  };
}
