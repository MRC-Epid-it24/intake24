import { computed, ref, watch } from 'vue';
import type { Carousel, Prompt } from '@intake24/common/prompts';

export type UseCarouselProps = Prompt & { carousel?: Carousel };

export function useCarousel(props: UseCarouselProps) {
  const carousel = ref(0);
  const watched = ref(false);

  watch(carousel, (val) => {
    if (val + 1 === props.carousel?.slides.length)
      watched.value = true;
  });

  const isValid = computed(() => !props.carousel?.required || carousel.value !== null);

  return {
    carousel,
    isValid,
    watched,
  };
}
