<template>
  <v-row>
    <v-col cols="12">
      <div class="guide-drawer">
        <v-img ref="img" v-resize="onImgResize" :src="imageMapData.baseImageUrl">
          <template #placeholder>
            <image-placeholder></image-placeholder>
          </template>
        </v-img>
        <div v-if="hasLabelSlot" class="label">
          <slot name="label"></slot>
        </div>
        <svg ref="svg">
          <polygon
            v-for="(polygon, idx) in polygons"
            :key="idx"
            class="guide-drawer-polygon"
            :class="{ active: idx === value }"
            :points="polygon"
            @click.stop="select(idx)"
            @keypress.stop="select(idx)"
          ></polygon>
        </svg>
      </div>
    </v-col>
    <v-col v-if="isMobile" cols="12" sm="auto">
      <v-btn :block="isMobile" color="success" :disabled="isDisabled" @click="confirm">
        {{ $t('common.action.continue') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import chunk from 'lodash/chunk';
import debounce from 'lodash/debounce';
import { defineComponent, ref } from 'vue';

import type { ImageMapResponse } from '@intake24/common/types/http';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

export default defineComponent({
  name: 'ImageMapSelector',

  components: { ImagePlaceholder },

  props: {
    disabled: {
      type: Boolean,
    },
    imageMapData: {
      type: Object as PropType<ImageMapResponse>,
      required: true,
    },
    value: {
      type: Number,
    },
  },

  setup() {
    const img = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    return { img, svg };
  },

  data() {
    return {
      height: 0,
      width: 0,
    };
  },

  computed: {
    isDisabled() {
      return this.disabled || this.value === undefined;
    },

    hasLabelSlot(): boolean {
      return !!this.$slots.label;
    },

    polygons(): string[] {
      const { width } = this;

      return this.imageMapData.objects.map((object) => {
        return chunk(
          object.outline.map((coord) => coord * width),
          2
        )
          .map((node) => node.join(','))
          .join(' ');
      });
    },
  },

  created() {
    this.debouncedGuideImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);
  },

  methods: {
    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedGuideImgResize();
    },

    updateSvgDimensions() {
      const el = this.img?.$el;
      if (!el) {
        console.warn(`GuideImagePanel: could not update SVG dimensions.`);
        return;
      }
      const { width, height } = el.getBoundingClientRect();
      this.width = width;
      this.height = height;
    },

    select(idx: number) {
      this.$emit('input', idx);

      if (!this.isMobile) this.confirm();
    },

    confirm() {
      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped>
.guide-drawer {
  position: relative;

  .label {
    position: absolute;
    bottom: 0;
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

      &.active,
      &:hover {
        fill: #0d47a1;
        fill-opacity: 0.4;
        stroke-width: 8;
        stroke: #0d47a1;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-opacity: 0.5;
      }
    }
  }
}
</style>
