<template>
  <base-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-expansion-panels v-model="panel" :tile="$vuetify.display.mobile">
      <v-expansion-panel :readonly="portionSizeMethods.length === 1">
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.method`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="psmValid" />
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <portion-size-methods
            v-bind="{ foodName, modelValue: food.portionSizeMethodIndex, portionSizeMethods }"
            @update:model-value="action('changeMethod', $event)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.serving.header`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="servingImageConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.serving?.weight"
                :valid="servingImageConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <as-served-selector
            v-model="portionSize.serving"
            :as-served-set-id="parameters.servingImageSet"
            @confirm="confirmServing"
            @update:model-value="updateServing"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel
        v-if="leftoversEnabled && parameters.leftoversImageSet"
        :disabled="!servingImageConfirmed"
      >
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.leftovers.header`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="leftoversPrompt === false || leftoversImageConfirmed">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.leftovers?.weight"
                :valid="leftoversImageConfirmed"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <yes-no-toggle v-model="leftoversPrompt" class="mb-4" mandatory />
          <template v-if="leftoversPrompt">
            <i18n-t class="mb-4" :keypath="`prompts.${type}.leftovers.label`" tag="div">
              <template #food>
                <span class="font-weight-medium">{{ foodName }}</span>
              </template>
            </i18n-t>
            <as-served-selector
              v-model="portionSize.leftovers"
              :as-served-set-id="parameters.leftoversImageSet"
              :max-weight="portionSize.serving?.weight"
              type="leftovers"
              @confirm="confirmLeftovers"
              @update:model-value="updateLeftovers"
            />
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-if="multipleEnabled" :disabled="!servingValid">
        <v-expansion-panel-title>
          <i18n-t :keypath="`prompts.${type}.quantity`" tag="span">
            <template #food>
              <span class="font-weight-medium">{{ foodName }}</span>
            </template>
          </i18n-t>
          <template #actions>
            <expansion-panel-actions :valid="quantityValid">
              <quantity-badge
                v-if="prompt.badges"
                :amount="portionSize.quantity ?? undefined"
                unit=""
                :valid="quantityValid"
              />
            </expansion-panel-actions>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <component
            :is="prompt.multiple.type"
            v-if="prompt.multiple"
            v-model="portionSize.quantity"
            v-model:confirmed="quantityConfirmed"
            v-bind="multipleProps"
            @update:confirmed="confirmQuantity"
            @update:model-value="updateQuantity"
          />
        </v-expansion-panel-text>
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
        v-model:confirmed="linkedQuantityConfirmed"
        @update:confirmed="confirmLinkedQuantity"
        @update:model-value="selectLinkedQuantity"
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
import type { LinkedParent } from '../partials';
import { defineComponent } from 'vue';
import type { PromptStates } from '@intake24/common/prompts';
import type { PortionSizeParameters } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';
import { useFoodUtils } from '@intake24/survey/composables';
import { AsServedSelector, LinkedQuantity, QuantityBadge, QuantityCard, QuantitySlider } from '../partials';
import createBasePortion from './createBasePortion';

export default defineComponent({
  name: 'AsServedPrompt',

  components: {
    AsServedSelector,
    LinkedQuantity,
    QuantityBadge,
    Slider: QuantitySlider,
    Counter: QuantityCard,
    YesNoToggle,
  },

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

  emits: ['update:modelValue'],

  setup(props) {
    const { foodName } = useFoodUtils(props);

    return {
      foodName,
    };
  },

  data() {
    return {
      ...copy(this.modelValue),
    };
  },

  computed: {
    multipleProps() {
      if (!this.prompt.multiple)
        return undefined;

      const { type, ...rest } = this.prompt.multiple;

      return rest;
    },
    multipleEnabled(): boolean {
      return !!this.prompt.multiple && !!this.parameters.multiple;
    },
    leftoversEnabled() {
      return this.prompt.leftovers && !!this.parameters.leftoversImageSet;
    },
    servingValid(): boolean {
      return !!(this.portionSize.serving && this.servingImageConfirmed);
    },
    leftoversValid(): boolean {
      return !!(this.portionSize.leftovers && this.leftoversImageConfirmed);
    },
    quantityValid(): boolean {
      if (!this.prompt.multiple)
        return true;

      return !this.prompt.multiple.confirm || this.quantityConfirmed;
    },
    validConditions(): boolean[] {
      const conditions = [this.psmValid, this.servingValid];

      if (this.leftoversEnabled)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      if (this.multipleEnabled)
        conditions.push(this.quantityValid);

      if (this.linkedParent && !this.linkedParent.auto && this.linkedParent.categories.length)
        conditions.push(this.linkedQuantityConfirmed);

      return conditions;
    },
    nextStepConditions(): boolean[] {
      const conditions = [this.psmValid, this.servingValid];

      if (this.leftoversEnabled)
        conditions.push(this.leftoversPrompt === false || this.leftoversValid);

      if (this.multipleEnabled)
        conditions.push(this.quantityConfirmed);

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

    updateQuantity() {
      this.quantityConfirmed = false;
      this.update();
    },

    confirmQuantity() {
      this.quantityConfirmed = true;
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
        = (this.portionSize.serving?.weight ?? 0) * this.portionSize.quantity * this.portionSize.linkedQuantity;
      this.portionSize.leftoversWeight
        = (this.portionSize.leftovers?.weight ?? 0) * this.portionSize.quantity * this.portionSize.linkedQuantity;

      const state: PromptStates['as-served-prompt'] = {
        portionSize: this.portionSize,
        panel: this.panel,
        servingImageConfirmed: this.servingImageConfirmed,
        leftoversImageConfirmed: this.leftoversImageConfirmed,
        leftoversPrompt: this.leftoversPrompt,
        quantityConfirmed: this.quantityConfirmed,
        linkedQuantityConfirmed: this.linkedQuantityConfirmed,
      };

      this.$emit('update:modelValue', state);
    },
  },
});
</script>

<style lang="scss" scoped></style>
