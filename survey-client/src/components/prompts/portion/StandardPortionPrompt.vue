<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-expansion-panels v-model="panelOpen">
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.standardPortion.portionMethodLabel', { food: localeDescription }) }}
            <template v-slot:actions>
              <v-icon color="success" v-if="selectedOption">fas fa-fw fa-check</v-icon>
              <v-icon color="error" v-if="!selectedOption">fas fa-fw fa-exclamation</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-radio-group class="py-0" v-model="selectedOption">
              <v-radio
                v-for="(opt, i) in portionOptions"
                :key="i"
                :value="opt"
                :label="$t('portion.standardPortion.optionLabel', { food: opt })"
                @change="onSelectMethod"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header disable-icon-rotate>
            {{ $t('portion.standardPortion.label', { food: localeDescription }) }}
            <template v-slot:actions>
              <v-icon color="success" v-if="selectedQuantity">fas fa-fw fa-check</v-icon>
              <v-icon color="error" v-if="!selectedQuantity">fas fa-fw fa-exclamation</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <quantity-card
              :whole="true"
              :fraction="true"
              @update-quantity="onUpdateQuantity"
            ></quantity-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-card>
        <v-row v-if="hasErrors">
          <v-col>
            <error-alert :errors="errors"></error-alert>
          </v-col>
        </v-row>

        <v-row class="pa-2 mt-0">
          <v-col>
            <v-btn color="success" @click="submit()">Continue</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import {
  StandardPortionPromptProps,
  standardPortionPromptDefaultProps,
  QuantityValues,
} from '@common/prompts';
import ErrorAlert from '@/components/elements/ErrorAlert.vue';
import QuantityCard from '@/components/elements/QuantityCard.vue';
import localeContent from '@/components/mixins/localeContent';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'StandardPortionPrompt',

  mixins: [BasePortion, localeContent],

  components: { ErrorAlert, QuantityCard },

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => StandardPortionPromptProps,
    },
  },

  data() {
    return {
      ...merge(standardPortionPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      portionOptions: ['berries', 'punnets', 'bags'], // This should be modelled in the props
      selectedOption: '',
      selectedQuantity: false,
      panelOpen: 0,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.description);
    },
    hasErrors(): boolean {
      return !!this.errors.length;
    },
  },

  methods: {
    onSelectMethod() {
      this.clearErrors();
      this.panelOpen = 1;
    },
    clearErrors() {
      this.errors = [];
    },
    isValid() {
      if (this.selectedOption) {
        return true;
      }
      return false;
    },
    onUpdateQuantity(value: QuantityValues) {
      this.quantityValue = value;
    },
    submit() {
      if (!this.isValid()) {
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('portion.standardPortion.validation.required') as string),
        ];
        return;
      }
      this.$emit('Option selected', this.selectedOption);
      this.panelOpen = -1;
      this.selectedQuantity = true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
