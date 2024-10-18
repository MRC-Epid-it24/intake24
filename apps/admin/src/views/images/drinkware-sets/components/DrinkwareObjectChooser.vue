<template>
  <v-row>
    <v-col cols="12">
      <div class="guide-drawer">
        <v-img ref="img" :src="imageMapData.baseImageUrl">
          <template #placeholder>
            <image-placeholder />
          </template>
        </v-img>
        <svg ref="svg">
          <filter id="polygon-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          <polygon
            v-for="(object, idx) in objects"
            :key="idx"
            class="guide-drawer-polygon"
            :class="{ active: idx === index }"
            :points="object.polygon"
            @click.stop="select(idx, object.id)"
            @keypress.stop="select(idx, object.id)"
            @mouseleave="hoverIndex = undefined"
            @mouseover="hoverIndex = idx"
          />
        </svg>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/components';
import { useElementSize } from '@vueuse/core';
import { computed, defineComponent, onMounted, ref } from 'vue';

import type { ImageMap } from '@intake24/common/prompts';
import type { ImageMapResponse } from '@intake24/common/types/http';
import ImagePlaceholder from '@intake24/admin/components/util/ImagePlaceholder.vue';

import { useImageMap } from '../use-image-map';

export type ImageMapObject = {
  id: string;
  polygon: string;
};

export default defineComponent({
  name: 'DrinkwareObjectChooser',

  components: { ImagePlaceholder },

  props: {
    config: {
      type: Object as PropType<ImageMap>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    id: {
      type: String,
    },
    index: {
      type: Number,
    },
    imageMapData: {
      type: Object as PropType<ImageMapResponse>,
      required: true,
    },
    labels: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  emits: ['confirm', 'select'],

  setup(props, { emit }) {
    const img = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    // @ts-expect-error should allow vue instance?
    const { height, width } = useElementSize(img);

    const screenHeight = ref(0);
    const screenWidth = ref(0);

    const { hoverIndex, label, objects } = useImageMap(props, width);

    const isDisabled = computed(() =>
      typeof props.disabled === 'undefined' ? props.index === undefined : props.disabled,
    );

    const getScreenDimensions = () => {
      screenHeight.value = window.screen.height;
      screenWidth.value = window.screen.width;
    };

    const confirm = () => {
      emit('confirm');
    };

    onMounted(() => {
      getScreenDimensions();
    });

    return {
      height,
      width,
      confirm,
      img,
      isDisabled,
      svg,
      hoverIndex,
      label,
      objects,
      screenHeight,
      screenWidth,
    };
  },

  methods: {
    select(idx: number, id: string) {
      this.$emit('select', idx, id);

      if (!this.$vuetify.display.mobile)
        this.confirm();
    },
  },
});
</script>

<style lang="scss">
@use 'src/scss/variables';

.guide-drawer {
  position: relative;

  .label {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
  }

  .pinch-zoom-activator {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    .guide-drawer-polygon {
      cursor: pointer;
      fill: transparent;

      &.active {
        stroke-width: 8;
        stroke: variables.$primary;
        stroke-linecap: round;
        stroke-linejoin: round;
        filter: url(#polygon-blur);
      }

      &:hover {
        stroke-width: 8;
        stroke: variables.$info;
        stroke-linecap: round;
        stroke-linejoin: round;
        filter: url(#polygon-blur);
      }
    }
  }
}
</style>
