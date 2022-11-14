<template>
  <portion-layout
    v-bind="{ method: portionSize.method, description, text, food, isValid }"
    @nav-action="navAction"
  >
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <!-- Step 0: Select Volume to measure estimated portion-->
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`portion.${portionSize.method}.container`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="objectValid"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <image-map-selector
            v-if="imageMapData"
            v-bind="{ imageMapData, sizes, value: portionSize.containerIndex }"
            @confirm="confirmObject"
            @input="selectObject"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Step 1: Select Serving Weight ml-->
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.serving.header`, { food: foodName }) }}
          <template #actions>
            <quantity-badge
              :amount="portionSize.servingWeight ?? undefined"
              unit="ml"
              :valid="quantityConfirmed"
            ></quantity-badge>
            <valid-invalid-icon :valid="quantityConfirmed"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              {{ $t(`portion.${portionSize.method}.serving.label`, { food: foodName }) }}
            </v-col>
          </v-row>
          <drink-scale-panel
            v-if="scale"
            v-model="portionSize.fillLevel"
            :open="panel === 1"
            :scale="scale"
            @confirm="confirmQuantity"
            @input="updateQuantity"
          >
          </drink-scale-panel>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="!disabledLeftovers">
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.leftovers.header`, { food: foodName }) }}
          <template #actions>
            <quantity-badge
              :amount="portionSize.leftoversWeight ?? undefined"
              unit="ml"
              :valid="leftoversConfirmed"
            ></quantity-badge>
            <valid-invalid-icon
              :valid="leftoversPrompt === false || leftoversConfirmed"
            ></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <!-- Step 2: Select LeftOvers-->
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <p>
                {{
                  $t(`portion.${portionSize.method}.leftovers.question`, {
                    food: foodName,
                  })
                }}
              </p>
              <v-btn-toggle v-model="leftoversPrompt" color="success" @change="update">
                <v-btn class="px-4" :value="true">
                  {{ $t('common.action.confirm.yes') }}
                </v-btn>
                <v-btn class="px-4" :value="false">
                  {{ $t('common.action.confirm.no') }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <template v-if="leftoversPrompt">
            <v-row>
              <v-col>
                {{ $t(`portion.${portionSize.method}.leftovers.label`, { food: foodName }) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <drink-scale-panel
                  v-if="scale"
                  v-model="portionSize.leftoversLevel"
                  :max-fill-level="portionSize.fillLevel"
                  :open="panel === 2"
                  :scale="scale"
                  :type="'leftovers'"
                  @confirm="confirmLeftovers"
                  @input="updateLeftovers"
                >
                </drink-scale-panel>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <template #actions>
      <continue :disabled="!isValid" @click="navAction('next')"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DrinkScalePromptProps } from '@intake24/common/prompts';
import type { DrinkScaleParameters, DrinkScaleState } from '@intake24/common/types';
import type {
  DrinkwareSetResponse,
  DrinkwareVolumeSampleResponse,
  ImageMapResponse,
} from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';

import createBasePortion from './createBasePortion';
import { calculateVolume, DrinkScalePanel, ImageMapSelector, QuantityBadge } from './selectors';

export interface DrinkScalePromptState {
  portionSize: DrinkScaleState;
  panel: number;
  objectConfirmed: boolean;
  quantityConfirmed: boolean;
  leftoversConfirmed: boolean;
  leftoversPrompt?: boolean;
}

export default defineComponent({
  name: 'DrinkScalePrompt',

  components: { DrinkScalePanel, ImageMapSelector, QuantityBadge },

  mixins: [createBasePortion<DrinkScalePromptProps, DrinkScalePromptState>()],

  props: {
    parameters: {
      type: Object as PropType<DrinkScaleParameters>,
      required: true,
    },
  },

  data() {
    const state = copy(this.initialState);
    state.portionSize.drinkwareId = this.parameters['drinkware-id'];
    state.portionSize.initialFillLevel = Number.parseFloat(this.parameters['initial-fill-level']);
    state.portionSize.skipFillLevel = this.parameters['skip-fill-level'] === 'true';

    if (!state.portionSize.fillLevel)
      state.portionSize.fillLevel = state.portionSize.initialFillLevel;

    return {
      ...state,
      drinkwareSetData: null as DrinkwareSetResponse | null,
      imageMapData: null as ImageMapResponse | null,
    };
  },

  computed: {
    disabledLeftovers() {
      return !this.leftovers;
    },

    scale() {
      if (!this.drinkwareSetData || this.portionSize.containerIndex === undefined) return undefined;

      return this.drinkwareSetData.scales[this.portionSize.containerIndex];
    },

    skipFillLevel() {
      return this.parameters['skip-fill-level'] === 'true';
    },

    sizes() {
      if (!this.drinkwareSetData) return [];

      return this.drinkwareSetData.scales.map(
        (scale) => `${Math.round(scale.volumeSamples[scale.volumeSamples.length - 1].volume)} ml`
      );
    },

    volumes(): DrinkwareVolumeSampleResponse[] | undefined {
      return this.scale?.volumeSamples;
    },

    objectValid() {
      return this.portionSize.containerIndex !== undefined && this.objectConfirmed;
    },

    quantityValid() {
      return this.quantityConfirmed;
    },

    leftoversValid() {
      return this.leftoversConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.objectValid, this.quantityValid];

      if (!this.disabledLeftovers)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      return conditions;
    },
  },

  async mounted() {
    await this.fetchDrinkScaleData();
  },

  methods: {
    async fetchDrinkScaleData() {
      const { data: drinkwareSetData } = await this.$http.get<DrinkwareSetResponse>(
        `portion-sizes/drinkware-sets/${this.parameters['drinkware-id']}`
      );

      this.drinkwareSetData = { ...drinkwareSetData };

      const { data: imageMapData } = await this.$http.get<ImageMapResponse>(
        `portion-sizes/image-maps/${this.drinkwareSetData.guideImageId}`
      );

      this.imageMapData = { ...imageMapData };
    },

    selectObject(idx: number) {
      const { drinkwareSetData } = this;
      if (!drinkwareSetData) return;

      this.objectConfirmed = false;

      this.portionSize.containerIndex = idx;
      this.portionSize.imageUrl = drinkwareSetData.scales[idx].baseImageUrl;

      this.clearQuantity();
      this.clearLeftovers();

      if (this.volumes)
        this.portionSize.servingWeight = calculateVolume(this.volumes, this.portionSize.fillLevel);

      this.update();
    },

    confirmObject() {
      this.objectConfirmed = true;

      if (this.skipFillLevel) this.quantityConfirmed = true;

      this.updatePanel();
      this.update();
    },

    clearQuantity() {
      this.portionSize.fillLevel = this.portionSize.initialFillLevel;
      this.quantityConfirmed = false;
    },

    updateQuantity() {
      this.quantityConfirmed = false;
      this.clearLeftovers();
      this.update();
    },

    confirmQuantity() {
      this.quantityConfirmed = true;
      this.updatePanel();
      this.update();
    },

    clearLeftovers() {
      this.portionSize.leftovers = false;
      this.leftoversConfirmed = false;
      this.leftoversPrompt = undefined;
    },

    updateLeftovers() {
      this.leftoversConfirmed = false;
      this.update();
    },

    confirmLeftovers() {
      this.leftoversConfirmed = true;
      this.updatePanel();
      this.update();
    },

    update() {
      const { volumes } = this;
      if (volumes) {
        this.portionSize.servingWeight = calculateVolume(volumes, this.portionSize.fillLevel);
        this.portionSize.leftoversWeight = calculateVolume(
          volumes,
          this.portionSize.leftoversLevel
        );
      }

      const state: DrinkScalePromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        objectConfirmed: this.objectConfirmed,
        quantityConfirmed: this.quantityConfirmed,
        leftoversConfirmed: this.leftoversConfirmed,
        leftoversPrompt: this.leftoversPrompt,
      };

      this.$emit('update', { state, valid: this.isValid });
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },
  },
});
</script>

<style lang="scss" scoped></style>
