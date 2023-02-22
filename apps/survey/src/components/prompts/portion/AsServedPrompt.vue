<template>
  <portion-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :flat="isMobile" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`prompts.${type}.serving.header`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <quantity-badge
              :amount="portionSize.serving?.weight"
              :valid="servingImageConfirmed"
            ></quantity-badge>
            <valid-invalid-icon class="ml-1" :valid="servingImageConfirmed"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <as-served-selector
            :as-served-set-id="parameters['serving-image-set']"
            :initial-object="portionSize.serving ?? undefined"
            @confirm="confirmServing"
            @update="updateServing"
          ></as-served-selector>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel
        v-if="!disabledLeftovers && parameters['leftovers-image-set']"
        :disabled="!servingImageConfirmed"
      >
        <v-expansion-panel-header disable-icon-rotate>
          <i18n :path="`prompts.${type}.leftovers.header`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <quantity-badge
              :amount="portionSize.leftovers?.weight"
              :valid="leftoversImageConfirmed"
            ></quantity-badge>
            <valid-invalid-icon
              class="ml-1"
              :valid="leftoversPrompt === false || leftoversImageConfirmed"
            ></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4"></yes-no-toggle>
          <template v-if="leftoversPrompt">
            <i18n class="mb-4" :path="`prompts.${type}.leftovers.label`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <as-served-selector
              :as-served-set-id="parameters['leftovers-image-set']"
              :initial-object="portionSize.leftovers ?? undefined"
              :max-weight="portionSize.serving?.weight"
              type="leftovers"
              @confirm="confirmLeftovers"
              @update="updateLeftovers"
            ></as-served-selector>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="linkedQuantityCategories.length">
        <v-expansion-panel-header disable-icon-rotate>
          <i18n path="prompts.linkedAmount.label">
            <template #unit>{{ linkedQuantityUnit }}</template>
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
            <template #quantity>
              <span class="font-weight-medium">{{ parentQuantity }}</span>
            </template>
          </i18n>
          <template #actions>
            <valid-invalid-icon :valid="linkedQuantityConfirmed"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <quantity-card
            v-model="linkedQuantity"
            :confirm.sync="linkedQuantityConfirmed"
            :max="parentQuantity"
            :show-all="!!linkedQuantityCategories.length"
            @input="selectLinkedQuantity"
            @update:confirm="confirmLinkedQuantity"
          ></quantity-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  AsServedState,
  PortionSizeParameters,
  SelectedAsServedImage,
} from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { useFoodUtils, useLocale } from '@intake24/survey/composables';

import createBasePortion from './createBasePortion';
import { AsServedSelector, QuantityBadge, QuantityCard } from './selectors';
import { useStandardUnits } from './useStandardUnits';

export interface AsServedPromptState {
  portionSize: AsServedState;
  panel: number;
  servingImageConfirmed: boolean;
  leftoversImageConfirmed: boolean;
  leftoversPrompt?: boolean;
  linkedQuantity: number;
  linkedQuantityConfirmed: boolean;
}

export default defineComponent({
  name: 'AsServedPrompt',

  components: { AsServedSelector, QuantityBadge, QuantityCard, YesNoToggle },

  mixins: [createBasePortion<'as-served-prompt', AsServedPromptState>()],

  props: {
    parameters: {
      type: Object as PropType<PortionSizeParameters['as-served']>,
      required: true,
    },
  },

  emits: ['update'],

  setup(props) {
    const { getLocaleContent } = useLocale();
    const { foodName } = useFoodUtils(props.food);
    const { standardUnitRefs, fetchStandardUnits } = useStandardUnits();

    return { standardUnitRefs, fetchStandardUnits, foodName, getLocaleContent };
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    disabledLeftovers() {
      return !this.prompt.leftovers;
    },

    hasLeftovers() {
      return !!this.parameters['leftovers-image-set'];
    },

    servingValid(): boolean {
      return !!(this.portionSize.serving && this.servingImageConfirmed);
    },

    leftoversValid(): boolean {
      return !!(this.portionSize.leftovers && this.leftoversImageConfirmed);
    },

    linkedQuantityUnit() {
      const unit = this.linkedQuantityCategories[0]?.unit;
      if (!unit || !this.standardUnitRefs[unit]) return this.$t('prompts.linkedAmount.unit');

      return this.getLocaleContent(this.standardUnitRefs[unit].howMany, {
        path: 'prompts.linkedAmount.unit',
      });
    },

    linkedQuantityValid(): boolean {
      return this.linkedQuantityConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.servingValid];

      if (!this.disabledLeftovers && this.hasLeftovers)
        conditions.push(
          !this.hasLeftovers || this.leftoversPrompt === false || this.leftoversValid
        );

      if (this.linkedQuantityCategories.length) conditions.push(this.linkedQuantityConfirmed);

      return conditions;
    },
  },

  watch: {
    leftoversPrompt(val) {
      if (val === true) this.portionSize.leftovers = null;

      this.updatePanel();
      this.update();
    },
  },

  async mounted() {
    if (!this.linkedQuantityCategories.length) return;

    const names = this.linkedQuantityCategories.map(({ unit }) => unit).filter(Boolean);
    if (names.length) await this.fetchStandardUnits(names as string[]);

    if (!this.linkedQuantityConfirmed) this.linkedQuantity = this.parentQuantity;
  },

  methods: {
    updateServing(update: SelectedAsServedImage | null) {
      this.portionSize.serving = update;
      this.servingImageConfirmed = false;
      this.clearLeftovers();

      if (this.isValid) this.clearErrors();

      this.update();
    },

    confirmServing() {
      this.servingImageConfirmed = true;
      this.updatePanel();
      this.update();
    },

    clearLeftovers() {
      this.portionSize.leftovers = null;
      this.leftoversImageConfirmed = false;
      this.leftoversPrompt = undefined;
    },

    updateLeftovers(update: SelectedAsServedImage | null) {
      this.portionSize.leftovers = update;
      this.leftoversImageConfirmed = false;

      if (this.isValid) this.clearErrors();

      this.update();
    },

    confirmLeftovers() {
      this.leftoversImageConfirmed = true;
      this.updatePanel();
      this.update();
    },

    selectLinkedQuantity() {
      this.update();
    },

    confirmLinkedQuantity() {
      this.updatePanel();
      this.update();
    },

    update() {
      this.portionSize.servingWeight =
        (this.portionSize.serving?.weight ?? 0) * this.linkedQuantity;
      this.portionSize.leftoversWeight =
        (this.portionSize.leftovers?.weight ?? 0) * this.linkedQuantity;

      const state: AsServedPromptState = {
        portionSize: this.portionSize,
        panel: this.panel,
        servingImageConfirmed: this.servingImageConfirmed,
        leftoversImageConfirmed: this.leftoversImageConfirmed,
        leftoversPrompt: this.leftoversPrompt,
        linkedQuantity: this.linkedQuantity,
        linkedQuantityConfirmed: this.linkedQuantityConfirmed,
      };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
