import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { FoodBrowser } from '@intake24/common/prompts';

export default defineComponent({
  name: 'FoodBrowserProps',

  props: {
    categoriesFirst: {
      type: Object as PropType<FoodBrowser['categoriesFirst']>,
      required: true,
    },
    allowThumbnails: {
      type: Boolean as PropType<FoodBrowser['allowThumbnails']>,
      required: true,
    },
    enableGrid: {
      type: Boolean as PropType<FoodBrowser['enableGrid']>,
      required: true,
    },
    gridThreshold: {
      type: Number as PropType<FoodBrowser['gridThreshold']>,
      required: true,
    },
  },
});
