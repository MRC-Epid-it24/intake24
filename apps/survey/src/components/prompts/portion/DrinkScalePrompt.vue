<template>
  <portion-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <!-- Step 0: Select Volume to measure estimated portion-->
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`prompts.${type}.container`">
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
            v-bind="{
              config: prompt.imageMap,
              imageMapData,
              id: portionSize.containerId,
              index: portionSize.containerIndex,
              sizes,
            }"
            @confirm="confirmObject"
            @select="selectObject"
          ></image-map-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Step 1: Select Serving Weight ml-->
      <v-expansion-panel :disabled="!objectValid">
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.serving.header`, { food: foodName }) }}
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
          <p>{{ $t(`prompts.${type}.serving.label`, { food: foodName }) }}</p>
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
      <v-expansion-panel v-if="!disabledLeftovers" :disabled="!quantityConfirmed">
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`prompts.${type}.leftovers.header`, { food: foodName }) }}
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
        <!-- Step 2: Select Leftovers-->
        <v-expansion-panel-content>
          <p>{{ $t(`prompts.${type}.leftovers.question`, { food: foodName }) }}</p>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4"></yes-no-toggle>
          <template v-if="leftoversPrompt">
            <p>{{ $t(`prompts.${type}.leftovers.label`, { food: foodName }) }}</p>
            <drink-scale-panel
              v-if="scale"
              v-model="portionSize.leftoversLevel"
              :max-fill-level="portionSize.fillLevel"
              :open="panel === 2"
              :scale="scale"
              type="leftovers"
              @confirm="confirmLeftovers"
              @input="updateLeftovers"
            >
            </drink-scale-panel>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { DrinkScaleParameters, DrinkScaleState } from '@intake24/common/types';
import type {
  DrinkwareSetResponse,
  DrinkwareVolumeSampleResponse,
  ImageMapResponse,
} from '@intake24/common/types/http/foods';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';

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

  components: { DrinkScalePanel, ImageMapSelector, QuantityBadge, YesNoToggle },

  mixins: [createBasePortion<'drink-scale-prompt', DrinkScalePromptState>()],

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
      return !this.prompt.leftovers;
    },

    scale() {
      const { containerId } = this.portionSize;
      if (containerId === undefined) return undefined;

      return this.drinkwareSetData?.scales.find(
        (scale) => scale.choiceId === parseInt(containerId, 10)
      );
    },

    skipFillLevel() {
      return this.parameters['skip-fill-level'] === 'true';
    },

    sizes() {
      return (
        this.imageMapData?.objects.map(({ id }) => {
          const match = this.drinkwareSetData?.scales.find(
            ({ choiceId }) => choiceId === parseInt(id, 10)
          );

          return match
            ? `${Math.round(match.volumeSamples[match.volumeSamples.length - 1].volume)} ml`
            : 'Missing';
        }) ?? []
      );
    },

    volumes(): DrinkwareVolumeSampleResponse[] | undefined {
      return this.scale?.volumeSamples;
    },

    objectValid() {
      return (
        this.portionSize.containerId !== undefined &&
        this.portionSize.containerIndex !== undefined &&
        this.objectConfirmed
      );
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

  watch: {
    leftoversPrompt() {
      this.updatePanel();
      this.update();
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

    selectObject(idx: number, id: string) {
      const { drinkwareSetData } = this;
      if (!drinkwareSetData) return;

      this.objectConfirmed = false;

      this.portionSize.containerIndex = idx;
      this.portionSize.containerId = id;
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

      this.$emit('update', { state });
    },

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
    },
  },
});
</script>

<style lang="scss" scoped></style>
