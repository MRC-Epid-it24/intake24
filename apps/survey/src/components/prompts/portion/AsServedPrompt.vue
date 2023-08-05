<template>
  <base-layout v-bind="{ food, prompt, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.serving.header`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="servingImageConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.serving?.weight"
                :valid="servingImageConfirmed"
              ></quantity-badge>
            </expansion-panel-actions>
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
        v-if="leftoversEnabled && parameters['leftovers-image-set']"
        :disabled="!servingImageConfirmed"
      >
        <v-expansion-panel-header>
          <i18n :path="`prompts.${type}.leftovers.header`">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n>
          <template #actions>
            <expansion-panel-actions :valid="leftoversPrompt === false || leftoversImageConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.leftovers?.weight"
                :valid="leftoversImageConfirmed"
              ></quantity-badge>
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4" mandatory></yes-no-toggle>
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
      <linked-quantity
        v-if="linkedQuantityCategories.length"
        v-bind="{ food, linkedQuantityCategories, parentFood, prompt }"
        v-model="portionSize.linkedQuantity"
        :confirm.sync="linkedQuantityConfirmed"
        :disabled="leftoversEnabled ? !leftoversValid : !servingValid"
        @input="selectLinkedQuantity"
        @update:confirm="confirmLinkedQuantity"
      ></linked-quantity>
    </v-expansion-panels>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters, SelectedAsServedImage } from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';
import { useLocale } from '@intake24/ui';

import { AsServedSelector, LinkedQuantity, QuantityBadge } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'AsServedPrompt',

  components: { AsServedSelector, LinkedQuantity, QuantityBadge, YesNoToggle },

  mixins: [createBasePortion<'as-served-prompt'>()],

  props: {
    linkedQuantityCategories: {
      type: Array as PropType<Prompts['guide-image-prompt']['linkedQuantityCategories']>,
      required: true,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['as-served']>,
      required: true,
    },
  },

  emits: ['update'],

  setup(props) {
    const { food } = toRefs(props);

    const { getLocaleContent } = useLocale();
    const { foodName } = useFoodUtils(food);

    return {
      foodName,
      getLocaleContent,
    };
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    leftoversEnabled() {
      return this.prompt.leftovers && !!this.parameters['leftovers-image-set'];
    },

    servingValid(): boolean {
      return !!(this.portionSize.serving && this.servingImageConfirmed);
    },

    leftoversValid(): boolean {
      return !!(this.portionSize.leftovers && this.leftoversImageConfirmed);
    },

    validConditions(): boolean[] {
      const conditions = [this.servingValid];

      if (this.leftoversEnabled)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      if (this.linkedQuantityCategories.length) conditions.push(this.linkedQuantityConfirmed);

      return conditions;
    },
  },

  watch: {
    leftoversPrompt() {
      this.portionSize.leftovers = null;

      this.updatePanel();
      this.update();
    },
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
        (this.portionSize.serving?.weight ?? 0) * this.portionSize.linkedQuantity;
      this.portionSize.leftoversWeight =
        (this.portionSize.leftovers?.weight ?? 0) * this.portionSize.linkedQuantity;

      const state: PromptStates['as-served-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        servingImageConfirmed: this.servingImageConfirmed,
        leftoversImageConfirmed: this.leftoversImageConfirmed,
        leftoversPrompt: this.leftoversPrompt,
        linkedQuantityConfirmed: this.linkedQuantityConfirmed,
      };

      this.$emit('update', { state });
    },
  },
});
</script>

<style lang="scss" scoped></style>
