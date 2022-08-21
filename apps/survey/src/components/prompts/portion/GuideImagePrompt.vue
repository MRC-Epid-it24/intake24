<template>
  <v-container>
    <portion-layout :text="promptProps.text" :description="promptProps.description">
      <template #headerText>
        {{ localeDescription }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen" flat>
            <!-- Step 1: Select guide -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.guideImage.label') }}
                <template #actions>
                  <v-icon v-if="selectedGuide" color="success">fas fa-fw fa-check</v-icon>
                  <v-icon v-if="!selectedGuide" color="error">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <div v-if="dataLoaded" class="guides-drawer">
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
                        <template #placeholder>
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
                          @keypress.stop="selectObject(idx)"
                        ></polygon>
                      </svg>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <!-- TODO: Value from image map/canvas -->
                    <v-btn color="success" block @click="onSelectGuide()">
                      {{ $t('common.action.continue') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- Step 2: Specify quantity -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.guideImage.quantity') }}
                <template #actions>
                  <v-icon v-if="selectedQuantity" color="success">fas fa-fw fa-check</v-icon>
                  <v-icon v-if="!selectedQuantity" color="error">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row align="center" justify="center">
                  <v-col>
                    <quantity-card :whole="true" :fraction="true" @update-quantity="updateQuantity">
                    </quantity-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-alert v-if="hasErrors" color="error">
                      <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                    </v-alert>
                    <v-btn color="success" block @click="confirmQuantity">
                      {{ $t('portion.common.confirmButton') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row class="ma-2">
        <v-col>
          <v-form ref="form" @submit.prevent="submit">
            <!-- Should be disabled if nothing selected? -->
            <continue :disabled="!continueEnabled" class="px-2" @click="submit"></continue>
          </v-form>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { VImg } from 'vuetify/lib';
import chunk from 'lodash/chunk';
import debounce from 'lodash/debounce';
import { defineComponent, ref } from 'vue';
import { Resize } from 'vuetify/lib/directives';

import type { BasePromptProps, QuantityValues } from '@intake24/common/prompts';
import type { EncodedFood, GuideImageState, LocaleTranslation } from '@intake24/common/types';
import type { GuideImageResponse } from '@intake24/common/types/http/foods';
import ImagePlaceholder from '@intake24/survey/components/elements/ImagePlaceholder.vue';
import QuantityCard from '@intake24/survey/components/elements/QuantityCard.vue';
import { localeContent } from '@intake24/survey/components/mixins';

import BasePortion from './BasePortion';

export interface GuideImagePromptState {
  portionSize: GuideImageState;
  objectConfirmed: boolean;
  quantityConfirmed: boolean;
  objectIdx: number | undefined;
  panelOpen: number;
}

export interface GuideImageEncodedFood {
  objectIdx: number | null;
  food: EncodedFood;
  mealId: number | undefined;
  panelOpen: number;
}

export default defineComponent({
  name: 'GuideImagePrompt',

  components: { ImagePlaceholder, QuantityCard },

  directives: { Resize },

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    guideImageId: {
      type: String,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    conversionFactor: {
      type: Number,
      required: true,
    },
    initialState: {
      type: Object as PropType<GuideImagePromptState>,
      required: true,
    },
    continueEnabled: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const img = ref<InstanceType<typeof VImg>>();
    const svg = ref<SVGElement>();

    return { img, svg };
  },

  data() {
    const selectedIndex = this.initialState.portionSize.object?.id;

    return {
      errors: [] as string[],
      selectedGuide: this.initialState.objectConfirmed && selectedIndex !== undefined,
      selectedQuantity: this.initialState.quantityConfirmed,
      guideImageData: {} as GuideImageResponse,
      width: 0,
      height: 0,
      selectedObjectIdx: selectedIndex !== undefined ? selectedIndex - 1 : 0,
      selectedNodeIdx: null as number | null,

      panelOpen: this.initialState.panelOpen,
      quantityValue: this.initialState.portionSize.quantity,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
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
        `portion-sizes/guide-images/${this.guideImageId}`
      );

      this.guideImageData = { ...data };
    },

    updateSvgDimensions() {
      const el = this.img?.$el;
      if (!el) {
        console.warn(`GuideImagePrompt: could not update SVG dimensions.`);
        return;
      }

      const { width, height } = el.getBoundingClientRect();
      this.width = width;
      this.height = height;
    },

    onImgResize() {
      //@ts-expect-error fix debounced types
      this.debouncedImgResize();
    },

    onUpdate() {
      if (this.selectedObjectIdx == null) return;
      const portionSizeState = this.getCurrentState(this.selectedObjectIdx);

      const update: GuideImagePromptState = {
        portionSize: portionSizeState,
        objectConfirmed: this.selectedGuide,
        quantityConfirmed: this.selectedQuantity,
        objectIdx: this.selectedObjectIdx + 1,
        panelOpen: this.panelOpen,
      };
      this.$emit('update', update);
    },

    getCurrentState(idx: number): GuideImageState {
      return {
        method: 'guide-image',
        servingWeight:
          this.guideImageData.weights[idx + 1] *
          (this.quantityValue.whole + this.quantityValue.fraction) *
          this.conversionFactor,
        leftoversWeight: 0, // Guide image does not allow estimating leftovers
        object: {
          id: idx + 1,
          weight: this.guideImageData.weights[idx + 1],
        },
        quantity: this.quantityValue,
      };
    },

    selectObject(idx: number) {
      this.selectedObjectIdx = idx;
      this.onUpdate();
    },

    onSelectGuide() {
      this.selectedGuide = true;
      this.panelOpen = 1;
      this.onUpdate();
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
    submit() {
      if (!this.isValid()) {
        // Should this also just accept the default value of 1?
        this.errors = [this.$t('portion.guideImage.validation.required').toString()];
        return;
      }

      if (this.selectedObjectIdx === undefined) throw new Error('Selected object id is null');

      this.$emit('continue');
    },

    updateQuantity(value: QuantityValues) {
      this.quantityValue = value;
      this.selectedQuantity = false;
      this.onUpdate();
    },
    confirmQuantity() {
      this.selectedQuantity = true;
      this.panelOpen = -1;
      this.onUpdate();
    },

    partialAnswerHandler() {
      this.onSelectGuide();
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
