<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <!-- Step 1: Select guide -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.guideImage.label') }}
                <template v-slot:actions>
                  <v-icon color="success" v-if="selectedGuide">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!selectedGuide">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <div class="guides-drawer" v-if="dataLoaded">
                      <v-img
                        ref="img"
                        v-resize="onImgResize"
                        :src="
                          guideImageData.imageMap.baseImageUrl.replace(
                            'http://localhost:3100',
                            'https://api.intake24.org'
                          )
                        "
                      >
                        <template v-slot:placeholder>
                          <image-placeholder></image-placeholder>
                        </template>
                      </v-img>
                      <svg ref="svg" :height="height" :width="width">
                        <polygon
                          v-for="(polygon, idx) in polygons"
                          :key="idx"
                          class="guides-drawer-polygon"
                          :class="{ active: idx === selectedObjectIdx }"
                          :points="polygon"
                          @click.stop="selectObject(idx)"
                        ></polygon>
                      </svg>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <!-- TODO: Value from image map/canvas -->
                    <v-btn color="success" @click="onSelectGuide()">
                      {{ $t('common.continue') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- Step 2: Specify quantity -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.guideImage.quantity') }}
                <template v-slot:actions>
                  <v-icon color="success" v-if="selectedQuantity">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!selectedQuantity">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <quantity-card :whole="true" :fraction="true" @update-quantity="updateQuantity">
                    </quantity-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-alert color="error" v-if="hasErrors">
                      <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                    </v-alert>
                    <v-btn color="success" @click="onSubmit">
                      {{ $t('portion.common.confirmButton') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import debounce from 'lodash/debounce';
import chunk from 'lodash/chunk';
import { VImg } from 'vuetify/lib';
import {
  GuideImagePromptProps,
  guideImagePromptDefaultProps,
  QuantityValues,
} from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import ImagePlaceholder from '@/components/elements/ImagePlaceholder.vue';
import QuantityCard from '@/components/elements/QuantityCard.vue';
import { GuideImageResponse } from '@common/types/http/foods';
import BasePortion, { Portion } from './BasePortion';

type Refs = {
  $refs: {
    img: InstanceType<typeof VImg>;
    svg: SVGElement;
  };
  debouncedImgResize: () => void;
};

export default (Vue as VueConstructor<Vue & Portion & Refs>).extend({
  name: 'GuideImagePrompt',

  mixins: [BasePortion, localeContent],

  components: { ImagePlaceholder, QuantityCard },

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => GuideImagePromptProps,
    },
  },

  data() {
    return {
      ...merge(guideImagePromptDefaultProps, this.props),
      errors: [] as string[],
      selectedGuide: false, // TODO: Model this correctly
      selectedQuantity: false,
      panelOpen: 0,

      guideImageData: {} as GuideImageResponse,
      width: 0,
      height: 0,
      selectedObjectIdx: null as number | null,
      selectedNodeIdx: null as number | null,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },

    dataLoaded(): boolean {
      return !!Object.keys(this.guideImageData).length;
    },
    polygons(): string[] {
      if (!this.dataLoaded) return [];

      const { width } = this;

      return this.guideImageData.imageMap.objects.map((object) => {
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
    this.debouncedImgResize = debounce(() => {
      this.updateSvgDimensions();
    }, 500);
  },

  mounted() {
    this.fetchGuideImageData();
  },

  methods: {
    async fetchGuideImageData() {
      const { data } = await this.$http.get<GuideImageResponse>(
        'portion-sizes/guide-images/AUSalccans'
      );

      this.guideImageData = { ...data };
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
      this.selectedObjectIdx = idx;
      console.log(this.guideImageData.weights[idx]);
    },

    onSelectGuide() {
      this.selectedGuide = !this.selectedGuide;
      this.panelOpen = 1;
    },
    clearErrors() {
      this.errors = [];
    },
    isValid() {
      if (this.selectedGuide) {
        return true;
      }
      return false;
    },
    onSubmit() {
      if (!this.isValid()) {
        // Should this also just accept the default value of 1?
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('portion.guideImage.validation.required') as string),
        ];
        return;
      }
      this.$emit('Guide image and quantity selected', this.selectedGuide, this.quantityValue);
      this.selectedQuantity = true; // Barely see the change of icon before transition
      this.panelOpen = -1; // Closes all panels
    },
    updateQuantity(value: QuantityValues) {
      this.quantityValue = value;
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
