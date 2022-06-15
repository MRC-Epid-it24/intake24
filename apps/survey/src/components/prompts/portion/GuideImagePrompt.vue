<template>
  <v-container>
    <portion-layout :text="promptProps.text" :description="promptProps.description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen" flat>
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
                <template v-slot:actions>
                  <v-icon color="success" v-if="selectedQuantity">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!selectedQuantity">fas fa-fw fa-exclamation</v-icon>
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
                    <v-alert color="error" v-if="hasErrors">
                      <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                    </v-alert>
                    <v-btn color="success" @click="submit" block>
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
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { PropType } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import debounce from 'lodash/debounce';
import chunk from 'lodash/chunk';
import type { VImg } from 'vuetify/lib';
import type { BasePromptProps, QuantityValues } from '@intake24/common/prompts';
import type { GuideImageResponse } from '@intake24/common/types/http/foods';
import type { LocaleTranslation, HasPartialAnswerTriggerHandler } from '@intake24/common/types';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import ImagePlaceholder from '@intake24/survey/components/elements/ImagePlaceholder.vue';
import QuantityCard from '@intake24/survey/components/elements/QuantityCard.vue';
import type { Portion } from './BasePortion';
import BasePortion from './BasePortion';

type Refs = {
  $refs: {
    img: InstanceType<typeof VImg>;
    svg: SVGElement;
  };
  debouncedImgResize: () => void;
};

export default (
  Vue as VueConstructor<Vue & HasPartialAnswerTriggerHandler & Portion & Refs>
).extend({
  name: 'GuideImagePrompt',

  mixins: [BasePortion, localeContent],

  components: { ImagePlaceholder, QuantityCard },

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
  },

  data() {
    return {
      errors: [] as string[],
      selectedGuide: false, // TODO: Model this correctly
      selectedQuantity: false,
      panelOpen: 0,

      guideImageData: {} as GuideImageResponse,
      width: 0,
      height: 0,
      selectedObjectIdx: null as number | null,
      selectedNodeIdx: null as number | null,
      quantityValue: { whole: 1, fraction: 0 } as QuantityValues,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMealIndex', 'selectedFoodIndex', 'currentTempPromptAnswer']),

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
      this.$emit('tempChanging', {
        modified: true,
        new: false,
        finished: false,
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        prompt: this.promptComponent,
        response: {
          object: {
            id: this.selectedObjectIdx,
            weight: this.guideImageData.weights[this.selectedObjectIdx],
          },
          quantity: this.quantityValue,
        },
      });
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
    submit() {
      if (!this.isValid()) {
        // Should this also just accept the default value of 1?
        this.errors = [this.$t('portion.guideImage.validation.required').toString()];
        return;
      }

      if (this.selectedObjectIdx === null) throw new Error('Selected object id is null');

      this.$emit('guide-image-selected', {
        object: {
          id: this.selectedObjectIdx,
          weight: this.guideImageData.weights[this.selectedObjectIdx],
        },
        quantity: this.quantityValue,
      });

      this.selectedQuantity = true; // Barely see the change of icon before transition
      this.panelOpen = -1; // Closes all panels
    },

    updateQuantity(value: QuantityValues) {
      this.quantityValue = value;
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
