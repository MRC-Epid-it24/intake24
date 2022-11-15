<template>
  <portion-layout
    v-bind="{ method: portionSize.method, description, text, food, isValid }"
    @nav-action="navAction"
  >
    <v-expansion-panels v-model="panel" flat :tile="isMobile">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.serving.header`) }}
          <template #actions>
            <quantity-badge
              :amount="portionSize.serving?.weight"
              :valid="servingImageConfirmed"
            ></quantity-badge>
            <valid-invalid-icon class="ml-1" :valid="servingImageConfirmed"></valid-invalid-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              {{ $t(`portion.${portionSize.method}.serving.label`, { food: foodName }) }}
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <as-served-selector
                :as-served-set-id="parameters['serving-image-set']"
                :initial-object="portionSize.serving ?? undefined"
                @confirm="confirmServing"
                @update="updateServing"
              ></as-served-selector>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="!disabledLeftovers && parameters['leftovers-image-set']">
        <v-expansion-panel-header disable-icon-rotate>
          {{ $t(`portion.${portionSize.method}.leftovers.header`, { food: foodName }) }}
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
          <p>{{ $t(`portion.${portionSize.method}.leftovers.question`, { food: foodName }) }}</p>
          <yes-no-toggle v-model="leftoversPrompt" @change="update"></yes-no-toggle>
          <template v-if="leftoversPrompt">
            <v-row>
              <v-col>
                {{ $t(`portion.${portionSize.method}.leftovers.label`, { food: foodName }) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <as-served-selector
                  :as-served-set-id="parameters['leftovers-image-set']"
                  :initial-object="portionSize.leftovers ?? undefined"
                  :max-weight="portionSize.serving?.weight"
                  type="leftovers"
                  @confirm="confirmLeftovers"
                  @update="updateLeftovers"
                ></as-served-selector>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="promptForLinkedQuantity">
        <v-expansion-panel-header disable-icon-rotate>
          <i18n path="portion.linkedAmount.label">
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
            :min="1"
            @input="selectLinkedQuantity"
            @update:confirm="confirmLinkedQuantity"
          ></quantity-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row v-show="errors.length">
      <v-col>
        <v-alert v-for="(e, idx) in errors" :key="idx" outlined type="error">
          {{ e }}
        </v-alert>
      </v-col>
    </v-row>
    <template #actions>
      <continue :disabled="!isValid" @click="navAction('next')"></continue>
    </template>
  </portion-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { AsServedPromptProps } from '@intake24/common/prompts';
import type {
  AsServedParameters,
  AsServedState,
  SelectedAsServedImage,
} from '@intake24/common/types';
import { copy } from '@intake24/common/util';
import { YesNoToggle } from '@intake24/survey/components/elements';

import createBasePortion from './createBasePortion';
import { AsServedSelector, QuantityBadge, QuantityCard } from './selectors';

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

  mixins: [createBasePortion<AsServedPromptProps, AsServedPromptState>()],

  props: {
    parameters: {
      type: Object as PropType<AsServedParameters>,
      required: true,
    },
  },

  data() {
    return {
      ...copy(this.initialState),
    };
  },

  computed: {
    disabledLeftovers() {
      return !this.leftovers;
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

    linkedQuantityValid(): boolean {
      return this.linkedQuantityConfirmed;
    },

    validConditions(): boolean[] {
      const conditions = [this.servingValid];

      if (!this.disabledLeftovers && this.hasLeftovers)
        conditions.push(
          !this.hasLeftovers || this.leftoversPrompt === false || this.leftoversValid
        );

      if (this.promptForLinkedQuantity) conditions.push(this.linkedQuantityConfirmed);

      return conditions;
    },
  },

  watch: {
    leftoversPrompt(val) {
      if (val !== false) return;

      this.portionSize.leftovers = null;
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

    setErrors() {
      this.errors = [this.$t('common.errors.expansionIncomplete').toString()];
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

      this.$emit('update', { state, valid: this.isValid });
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
