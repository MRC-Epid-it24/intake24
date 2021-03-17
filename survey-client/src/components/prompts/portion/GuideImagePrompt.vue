<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ localeDescription }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <!-- Step 1: Select guide -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.guideImage.label') }}
                <template v-slot:actions>
                  <v-icon color="success" v-if="selectedGuide">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!selectedGuide">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- TODO: Implement image map or alternative -->
                <v-row>
                  <v-col>
                    <v-img class="align-end" :src="selectionImageUrl" :aspect-ratio="16 / 9">
                      <template v-slot:placeholder>
                        <image-placeholder></image-placeholder>
                      </template>
                    </v-img>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <!-- TODO: Value from image map/canvas -->
                    <v-btn color="success" @click="onSelectGuide()">
                      {{ $t('common.continue') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!-- Step 2: Specify quantity -->
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.guideImage.quantity') }}
                <template v-slot:actions>
                  <v-icon color="success" v-if="selectedQuantity">fas fa-fw fa-check</v-icon>
                  <v-icon color="error" v-if="!selectedQuantity">fas fa-fw fa-exclamation</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <quantity-card :whole="true" :fraction="true" @update-quantity="updateQuantity">
                    </quantity-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-alert color="error" v-if="hasErrors">
                      <span v-for="(e, index) in errors" :key="index">{{ e }}</span>
                    </v-alert>
                    <v-btn color="success" @click="onSubmit">
                      {{ $t('portion.common.confirmButton') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import {
  GuideImagePromptProps,
  guideImagePromptDefaultProps,
  QuantityValues,
} from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import ImagePlaceholder from '@/components/elements/ImagePlaceholder.vue';
import QuantityCard from '@/components/elements/QuantityCard.vue';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'GuideImagePrompt',

  mixins: [BasePortion, localeContent],

  components: {
    ImagePlaceholder,
    QuantityCard,
  },

  props: {
    // Generic object 'props' used to store all props for each prompt
    props: {
      type: Object as () => GuideImagePromptProps,
    },
  },

  data() {
    return {
      ...merge(guideImagePromptDefaultProps, this.props),
      errors: [] as string[],
      selectedGuide: false, // TODO: Model this correctly
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
    onSelectGuide() {
      this.selectedGuide = !this.selectedGuide;
      this.panelOpen = 1;
    },
    clearErrors() {
      this.errors = [];
    },
    isValid() {
      if (this.selectedGuide) {
        return true;
      }
      return false;
    },
    onSubmit() {
      if (!this.isValid()) {
        // Should this also just accept the default value of 1?
        this.errors = [
          this.getLocaleContent(this.validation.message) ??
            (this.$t('portion.guideImage.validation.required') as string),
        ];
        return;
      }
      this.$emit('Guide image and quantity selected', this.selectedGuide, this.quantityValue);
      this.selectedQuantity = true; // Barely see the change of icon before transition
      this.panelOpen = -1; // Closes all panels
    },
    updateQuantity(value: QuantityValues) {
      this.quantityValue = value;
    },
  },
});
</script>

<style lang="scss" scoped></style>
