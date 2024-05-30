<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
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
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <as-served-selector
            v-model="portionSize.serving"
            :as-served-set-id="parameters.servingImageSet"
            @confirm="confirmServing"
            @input="updateServing"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel
        v-if="leftoversEnabled && parameters.leftoversImageSet"
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
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4" mandatory />
          <template v-if="leftoversPrompt">
            <i18n class="mb-4" :path="`prompts.${type}.leftovers.label`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n>
            <as-served-selector
              v-model="portionSize.leftovers"
              :as-served-set-id="parameters.leftoversImageSet"
              :max-weight="portionSize.serving?.weight"
              type="leftovers"
              @confirm="confirmLeftovers"
              @input="updateLeftovers"
            />
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <linked-quantity
        v-if="linkedParent && !linkedParent.auto"
        v-bind="{
          disabled: leftoversEnabled ? !leftoversValid : !servingValid,
          food,
          linkedParent,
          prompt,
        }"
        v-model="portionSize.linkedQuantity"
        :confirm.sync="linkedQuantityConfirmed"
        @input="selectLinkedQuantity"
        @update:confirm="confirmLinkedQuantity"
      />
    </v-expansion-panels>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </base-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';

import type { LinkedParent } from '../partials';
import { AsServedSelector, LinkedQuantity, QuantityBadge } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'AsServedPrompt',

  components: { AsServedSelector, LinkedQuantity, QuantityBadge, YesNoToggle },

  mixins: [createBasePortion<'as-served-prompt'>()],

  props: {
    linkedParent: {
      type: Object as PropType<LinkedParent>,
    },
    parameters: {
      type: Object as PropType<PortionSizeParameters['as-served']>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props) {
    const { translate } = useI18n();
    const { foodName } = useFoodUtils(props);

    return {
      foodName,
      translate,
    };
  },

  data() {
    return {
      ...copy(this.value),
    };
  },

  computed: {
    leftoversEnabled() {
      return this.prompt.leftovers && !!this.parameters.leftoversImageSet;
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

      if (this.linkedParent && !this.linkedParent.auto && this.linkedParent.categories.length)
        conditions.push(this.linkedQuantityConfirmed);

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
    updateServing() {
      this.servingImageConfirmed = false;
      this.clearLeftovers();

      if (this.isValid)
        this.clearErrors();

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

    updateLeftovers() {
      this.leftoversImageConfirmed = false;

      if (this.isValid)
        this.clearErrors();

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
      this.portionSize.servingWeight
        = (this.portionSize.serving?.weight ?? 0) * this.portionSize.linkedQuantity;
      this.portionSize.leftoversWeight
        = (this.portionSize.leftovers?.weight ?? 0) * this.portionSize.linkedQuantity;

      const state: PromptStates['as-served-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        servingImageConfirmed: this.servingImageConfirmed,
        leftoversImageConfirmed: this.leftoversImageConfirmed,
        leftoversPrompt: this.leftoversPrompt,
        linkedQuantityConfirmed: this.linkedQuantityConfirmed,
      };

      this.$emit('input', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
