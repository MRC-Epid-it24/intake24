<template>
  <div class="guides-drawer" v-if="dataLoaded">
    <v-img ref="img" v-resize="onImgResize" :src="imageMapData.baseImageUrl"> </v-img>
    <svg ref="svg" :height="height" :width="width">
      <polygon
        v-for="(polygon, idx) in polygons"
        :key="idx"
        class="guides-drawer-polygon"
        :class="{ active: idx === selectedIdx }"
        :points="polygon"
        @click.stop="selectObject(idx)"
        @keypress.stop="selectObject(idx)"
      ></polygon>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { merge } from '@intake24/common/util';
import debounce from 'lodash/debounce';
import chunk from 'lodash/chunk';
import { VImg } from 'vuetify/lib';
import { ImageMapSelectorProps, imageMapSelectorDefaultProps } from '@intake24/common/prompts';
import { ImageMapResponse } from '@intake24/common/types/http';
import { ImageMapEmit } from '@intake24/common/types/http/foods';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import BasePortion, { Portion } from '../BasePortion';

type Refs = {
  $refs: {
    img: InstanceType<typeof VImg>;
    svg: SVGElement;
  };
  debouncedImgResize: () => void;
};

export default (Vue as VueConstructor<Vue & Portion & Refs>).extend({
  name: 'ImageMapSelector',

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<ImageMapSelectorProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(imageMapSelectorDefaultProps, this.promptProps),
      errors: [] as string[],
      imageMapData: {} as ImageMapResponse,
      width: 0,
      height: 0,
      selectedIdx: null as number | null,
    };
  },

  computed: {
    hasErrors(): boolean {
      return !!this.errors.length;
    },

    dataLoaded(): boolean {
      return !!Object.keys(this.imageMapData).length;
    },
    polygons(): string[] {
      if (!this.dataLoaded) return [];

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

  // Appears to be a bug where $refs can't be found in PortionTest. Likely not an issue in production
  created() {
    this.debouncedImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);
  },

  mounted() {
    this.fetchImageMap();
  },

  methods: {
    async fetchImageMap() {
      try {
        const { data } = await this.$http.get<ImageMapResponse>(
          `portion-sizes/image-maps/${this.imageMapId}`
        );
        this.imageMapData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },
    updateSvgDimensions() {
      const { width, height } = this.$refs.img.$el.getBoundingClientRect();
      this.width = width;
      this.height = height;
    },
    onImgResize() {
      this.debouncedImgResize();
    },
    selectObject(idx: number) {
      this.selectedIdx = idx;
      this.$emit('image-map-selector-submit', {
        selectedIdx: this.selectedIdx,
      } as ImageMapEmit);
    },
  },
});
</script>

<style lang="scss" scoped>
.guides-drawer {
  position: relative;

  svg {
    position: absolute;
    top: 0;
    left: 0;

    .guides-drawer-polygon {
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
