<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.common.completeBelow') }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpenId">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.cereal.label') }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="bowlComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- <v-img :src="bowlImageMapData.baseImageUrl" @click="selectBowlType()"></v-img>
                Image_maps gbowl -->
                <image-map-selector
                  :promptProps="{ imageMapId }"
                  @image-map-selector-submit="selectBowlType($event)"
                ></image-map-selector>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.asServed.portionLabel', { food: localeDescription }) }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="asServedComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <as-served-selector
                  :asServedSetId="this.cerealType"
                  @as-served-selector-submit="setAsServedStatus($event)"
                ></as-served-selector>
                <!-- cereal_hoopA -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.asServed.leftoverQuestion', { food: localeDescription }) }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="leftoverComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <v-btn
                      @click="leftoverAnswer(true)"
                      :color="toggleLeftoverAnswer === true ? 'success' : ''"
                    >
                      {{ $t('common.action.confirm.yes') }}
                    </v-btn>
                    <v-btn
                      @click="leftoverAnswer(false)"
                      :color="toggleLeftoverAnswer === false ? 'success' : ''"
                    >
                      {{ $t('common.action.confirm.no') }}
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row v-show="displayLeftovers">
                  <v-col>
                    <as-served-selector
                      :asServedSetId="this.cerealType"
                      @as-served-selector-submit="setLeftoverStatus($event)"
                    ></as-served-selector>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-alert color="error" v-if="hasErrors">
            <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
          </v-alert>
          <v-btn @click="submit()" :color="submitButtonStyle()">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { merge } from '@intake24/common/util';
import {
  CerealPromptProps,
  cerealPromptDefaultProps,
  ImageMapSelectorEmit,
} from '@intake24/common/prompts';
import { LocaleTranslation } from '@intake24/common/types';
import { UserFoodData } from '@intake24/common/types/http';
import AsServedSelector from '@intake24/survey/components/prompts/portion/selectors/AsServedSelector.vue';
import ImageMapSelector from '@intake24/survey/components/prompts/portion/selectors/ImageMapSelector.vue';
import BaseExpansionPortion, { ExpansionPortion } from './BaseExpansionPortion';

export default (Vue as VueConstructor<Vue & ExpansionPortion>).extend({
  name: 'CerealPrompt',

  components: {
    AsServedSelector,
    ImageMapSelector,
  },

  mixins: [BaseExpansionPortion],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<CerealPromptProps>,
      required: true,
    },
    foodName: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    foodCode: {
      type: String,
      required: true,
    },
    imageMapId: {
      type: String,
      required: true,
    },
    localeTEMP: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      ...merge(cerealPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      foodData: {} as UserFoodData,
      bowlTypeSelected: null as number | null,
      cerealType: 'cereal_hoopA' as string,
      bowlComplete: false as boolean,
      asServedComplete: false as boolean,
      leftoverComplete: false as boolean,
      displayLeftovers: false as boolean,
      toggleLeftoverAnswer: null as boolean | null,
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
      return !!Object.keys(this.foodData).length;
    },
    isValid(): boolean {
      if (this.bowlComplete && this.asServedComplete && this.leftoverComplete) {
        this.clearErrors();
        return true;
      }
      return false;
    },
  },

  mounted() {
    this.fetchFoodData();
  },

  methods: {
    async fetchFoodData() {
      try {
        const { data } = await this.$http.get(`foods/${this.localeTEMP}/${this.foodCode}`);
        this.foodData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },

    leftoverAnswer(value: boolean) {
      if (value) {
        this.displayLeftovers = true;
        this.leftoverComplete = false;
        this.toggleLeftoverAnswer = true;
      } else {
        this.leftoverComplete = true;
        this.toggleLeftoverAnswer = false;
        this.setPanelOpen(3);
      }
    },

    selectBowlType(status: ImageMapSelectorEmit) {
      this.bowlTypeSelected = status.selectedIdx;
      this.bowlComplete = true;
      this.setPanelOpen(1);
      // Get as served now bowl is confirmed
    },

    // TODO: Implement emission type
    setAsServedStatus(status: Record<string, unknown>) {
      this.asServedComplete = true;
      this.setPanelOpen(2);
    },

    // TODO: Implement emission type
    setLeftoverStatus(status: Record<string, unknown>) {
      this.leftoverComplete = true;
      this.setPanelOpen(-1);
    },

    clearErrors() {
      this.errors = [];
    },

    submitButtonStyle() {
      if (this.isValid) {
        return 'success';
      }
      return '';
    },

    submit() {
      if (this.isValid) {
        // TODO Update state
        console.log('submitted');
      } else {
        this.errors = [this.$t('portion.milkCereal.validation.required').toString()];
      }
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
