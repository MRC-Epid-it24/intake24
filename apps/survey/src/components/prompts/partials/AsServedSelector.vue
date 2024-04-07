<template>
  <v-container>
    <v-row>
      <v-img :aspect-ratio="16 / 9" class="align-end" :src="image">
        <template #placeholder>
          <image-placeholder />
        </template>
        <v-row>
          <v-col class="d-flex justify-end mr-auto">
            <v-chip
              class="ma-1 ma-md-2 pa-3 pa-md-4 text-h6 font-weight-bold secondary--text border-secondary-1"
            >
              {{ thumbnailWeight }}
            </v-chip>
          </v-col>
        </v-row>
        <as-served-weight-factor
          v-bind="weightFactorProps"
          @input="updateWeightFactor"
        />
      </v-img>
    </v-row>
    <v-row v-if="asServedData" class="mt-4">
      <v-col class="pa-1 rounded-lg" cols="3" lg="auto" sm="2">
        <v-card :disabled="isLessWeightFactorActive" @click="updateSelection(-1)">
          <v-img :src="firstThumbnail" />
          <v-overlay absolute>
            <v-btn
              :disabled="isLessWeightFactorActive"
              icon
              :title="$t(`prompts.asServed.${type}.less`)"
              x-large
            >
              <v-icon>$decrement</v-icon>
            </v-btn>
          </v-overlay>
        </v-card>
      </v-col>
      <template v-for="(images, idx) in asServedData.images">
        <v-col
          :key="idx"
          class="pa-1 rounded-lg"
          :class="isSelected(idx)"
          cols="3"
          lg="auto"
          sm="2"
        >
          <v-card @click="setSelection(idx)">
            <v-img :src="images.thumbnailUrl" />
          </v-card>
        </v-col>
      </template>
      <v-col v-if="showMoreWeightFactor" class="pa-1 rounded-lg" cols="3" lg="auto" sm="2">
        <v-card :disabled="isMoreWeightFactorActive" @click="updateSelection(1)">
          <v-img :src="lastThumbnail" />
          <v-overlay absolute>
            <v-btn
              :disabled="isMoreWeightFactorActive"
              icon
              :title="$t(`prompts.asServed.${type}.more`)"
              x-large
            >
              <v-icon>$increment</v-icon>
            </v-btn>
          </v-overlay>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-1" cols="12" sm="auto">
        <v-btn :block="isMobile" color="primary" @click="confirm">
          {{ $t(`prompts.asServed.${type}.confirm`) }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { SelectedAsServedImage } from '@intake24/common/types';
import type { AsServedSetResponse } from '@intake24/common/types/http/foods';
import { ImagePlaceholder } from '@intake24/survey/components/elements';

import type { WeightFactorProps } from './AsServedWeightFactor.vue';
import AsServedWeightFactor from './AsServedWeightFactor.vue';

export default defineComponent({
  name: 'AsServedSelector',

  components: { AsServedWeightFactor, ImagePlaceholder },

  props: {
    asServedSetId: {
      type: String,
      required: true,
    },
    maxWeight: {
      type: Number,
    },
    type: {
      type: String as PropType<'serving' | 'leftovers'>,
      default: 'serving',
    },
    value: {
      type: Object as PropType<SelectedAsServedImage | null>,
      default: null,
    },
  },

  emits: ['confirm', 'input'],

  setup(props) {
    const denominator = 4;
    const objectIdx = ref<number | undefined>(undefined);
    const asServedData = ref<AsServedSetResponse | null>(null);

    const noWeightFactor = (weight: number): WeightFactorProps => ({
      show: false,
      type: props.type,
      subType: 'less',
      minNumerator: denominator,
      maxNumerator: denominator,
      denominator,
      weight,
      value: denominator,
    });

    const lessWeightFactor = (
      show: boolean,
      weight: number,
      value?: number,
    ): WeightFactorProps => ({
      show,
      type: props.type,
      subType: 'less',
      minNumerator: 1,
      maxNumerator: denominator - 1,
      denominator,
      weight,
      value: value ?? denominator - 1,
    });

    const moreWeightFactor = (show: boolean, weight: number, value?: number): WeightFactorProps => {
      let minNumerator = denominator + 1;
      let maxNumerator = denominator * 5;

      if (props.maxWeight) {
        if ((minNumerator / denominator) * weight >= props.maxWeight) {
          minNumerator = denominator;
          maxNumerator = denominator;
          value = denominator;
        }
        else {
          maxNumerator = denominator;

          while (
            ((maxNumerator + 1) / denominator) * weight < props.maxWeight
            && maxNumerator <= denominator * 5
          )
            maxNumerator += 1;
        }
      }

      return {
        show,
        type: props.type,
        subType: 'more',
        minNumerator,
        maxNumerator,
        denominator,
        weight,
        value: value ?? denominator + 1,
      };
    };

    const weightFactorProps = ref(noWeightFactor(0));

    return {
      denominator,
      objectIdx,
      asServedData,
      weightFactorProps,
      noWeightFactor,
      lessWeightFactor,
      moreWeightFactor,
    };
  },

  computed: {
    image(): string {
      if (this.objectIdx === undefined)
        return '';

      return this.asServedData?.images[this.objectIdx].mainImageUrl ?? '';
    },
    isLessWeightFactorActive(): boolean {
      return this.weightFactorProps.show && this.weightFactorProps.subType === 'less';
    },
    isMoreWeightFactorActive(): boolean {
      return this.weightFactorProps.show && this.weightFactorProps.subType === 'more';
    },
    thumbnailWeight(): string | null {
      if (this.objectIdx === undefined || !this.asServedData)
        return null;

      return `${Math.round(this.asServedData.images[this.objectIdx].weight)}g`;
    },
    firstThumbnail(): string {
      if (this.objectIdx === undefined)
        return '';

      return this.asServedData?.images[0].thumbnailUrl ?? '';
    },
    lastThumbnail(): string {
      if (this.objectIdx === undefined || !this.asServedData)
        return '';

      return this.asServedData.images[this.asServedData.images.length - 1].thumbnailUrl;
    },
    showMoreWeightFactor(): boolean {
      if (this.maxWeight === undefined)
        return true;

      if (this.objectIdx === undefined || !this.asServedData || !this.asServedData.images.length)
        return false;

      const { weight } = this.asServedData.images[this.asServedData.images.length - 1];

      return ((this.denominator + 1) / this.denominator) * weight < this.maxWeight;
    },
    weightFactor(): number {
      return this.weightFactorProps.value / this.weightFactorProps.denominator;
    },
  },

  watch: {
    async asServedSetId() {
      await this.fetchAsServedImageData();
    },
    async maxWeight(val) {
      if (!val)
        return;

      await this.fetchAsServedImageData();
    },
  },

  async mounted() {
    await this.fetchAsServedImageData();
  },

  methods: {
    async fetchAsServedImageData() {
      const { data } = await this.$http.get<AsServedSetResponse>(
        `portion-sizes/as-served-sets/${this.asServedSetId}`,
      );
      this.asServedData = { ...data };
      this.initSelection();
    },

    initSelection() {
      if (!this.asServedData || this.objectIdx !== undefined)
        return;

      const { maxWeight } = this;

      if (maxWeight) {
        this.asServedData.images = this.asServedData.images.filter(
          image => image.weight <= maxWeight,
        );
      }

      if (this.value?.index !== undefined)
        this.setSelection(this.value.index, true);
      else this.setSelection(Math.floor(this.asServedData.images.length / 2));
    },

    initWeightFactor(asServedData: AsServedSetResponse, objectIdx: number) {
      const objectWeight = asServedData.images[objectIdx].weight;
      const initWeight = this.value?.weight;

      if (initWeight === undefined)
        return;

      const value = Math.round((initWeight / objectWeight) * this.denominator);

      if (initWeight > objectWeight && objectIdx === asServedData.images.length - 1) {
        this.weightFactorProps = this.moreWeightFactor(
          true,
          asServedData.images[objectIdx].weight,
          value,
        );

        return;
      }

      if (initWeight < objectWeight && objectIdx === 0) {
        this.weightFactorProps = this.lessWeightFactor(
          true,
          asServedData.images[objectIdx].weight,
          value,
        );

        return;
      }

      this.noWeightFactor(asServedData.images[objectIdx].weight);
    },

    setSelection(objectIdx: number, init = false) {
      const { asServedData } = this;
      if (!asServedData)
        return;

      if (objectIdx >= asServedData.images.length) {
        this.weightFactorProps = this.moreWeightFactor(
          true,
          asServedData.images[asServedData.images.length - 1].weight,
        );
        this.update();
        return;
      }

      if (objectIdx < 0) {
        this.weightFactorProps = this.lessWeightFactor(true, asServedData.images[0].weight);
        this.update();
        return;
      }

      this.objectIdx = objectIdx;

      if (init)
        this.initWeightFactor(asServedData, objectIdx);
      else this.weightFactorProps = this.noWeightFactor(asServedData.images[objectIdx].weight);
      this.update();
    },

    updateSelection(value: number) {
      const { objectIdx } = this;
      if (objectIdx === undefined)
        return;

      this.setSelection(objectIdx + value);
    },

    updateWeightFactor(value: number) {
      this.weightFactorProps.value = value;
      this.update();
    },

    isSelected(idx: number): string {
      return idx === this.objectIdx ? 'border-primary-2' : '';
    },

    update() {
      const { objectIdx, asServedData, asServedSetId } = this;
      if (objectIdx === undefined || !asServedData)
        return;

      const state: SelectedAsServedImage = {
        asServedSetId,
        index: objectIdx,
        weight: asServedData.images[objectIdx].weight * this.weightFactor,
        imageUrl: asServedData.images[objectIdx].mainImageUrl,
      };

      this.$emit('input', state);
    },

    confirm() {
      if (this.objectIdx === undefined)
        return;

      this.$emit('confirm');
    },
  },
});
</script>

<style lang="scss" scoped></style>
