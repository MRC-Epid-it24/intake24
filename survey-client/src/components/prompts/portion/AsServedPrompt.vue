<template>
  <v-container>
    <portion-layout :text="promptProps.text" :description="promptProps.description">
      <template v-slot:headerText>
        {{ $t('portion.asServed.label', { food: localeDescription }) }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                Select portion size
                <template v-slot:actions>
                  <valid-invalid-icon :valid="servingCompleteStatus"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                    <v-col>
                      {{ $t('portion.asServed.label', { food: localeDescription }) }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <!-- This currently is taking asServed data, not the leftover data -->
                      <as-served-selector
                        :asServedData="this.selectionImageData"
                        @as-served-selector-submit="setServingStatus($event)"
                      ></as-served-selector>
                    </v-col>
                  </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                {{ $t('portion.asServedLeftover.question', { food: localeDescription }) }}
                <template v-slot:actions>
                  <valid-invalid-icon :valid="leftoverCompleteStatus"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                  <v-row>
                    <v-col>
                      <v-btn>Yes</v-btn>
                      <v-btn>No</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      {{ $t('portion.asServedLeftover.label', { food: localeDescription }) }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <!-- This currently is taking asServed data, not the leftover data -->
                      <as-served-selector
                        :asServedData="this.selectionImageData"
                        :imageSet="this.selectionImageData.images"
                        @as-served-selector-submit="setLeftoverStatus($event)"
                      ></as-served-selector>
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

import localeContent from '@/components/mixins/localeContent';
import ValidInvalidIcon from '@/components/elements/ValidInvalidIcon.vue';
import AsServedSelector from '@/components/prompts/portion/AsServedSelector.vue';
import { AsServedSetResponse } from '@common/types/http/foods';
import { basePromptProps, BasePromptProps } from '@common/prompts';
import { LocaleTranslation } from '@common/types';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'AsServedPrompt',

  components: {
    ValidInvalidIcon,
    AsServedSelector,
  },

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => BasePromptProps,
      required: true,
    },
    foodName: {
      type: Object as () => LocaleTranslation,
      required: true,
    },
    asServedSetId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      ...merge(basePromptProps, this.promptProps),
      errors: [] as string[],
      panelOpen: 0 as number,
      selectionImageData: {} as AsServedSetResponse,
      servingIdx: null as number | null,
      leftoverIdx: null as number | null,
      servingCompleteStatus: false as boolean,  // Used to control the icons
      leftoverCompleteStatus: false as boolean,  // Used to control the icons
      dataLoaded: false as boolean,
    };
  },

  computed: {
    localeDescription(): string | null {
      return this.getLocaleContent(this.foodName);
    },
  },

  mounted() {
    this.fetchSelectionImageData();
  },

  methods: {
    async fetchSelectionImageData() {
      // AsServed Data
      try {
        const { data } = await this.$http.get<AsServedSetResponse>(
          `portion-sizes/as-served-sets/${this.asServedSetId}`
        );
        this.selectionImageData = { ...data };
        this.setDataLoaded();
      } catch (e) {
        console.log(e);
      }
      // Leftover Data
      // try {
      //   const { data } = await this.$http.get<AsServedSetResponse>(
      //     `portion-sizes/as-served-sets/${this.asServedSetId}`
      //   );
      //   this.selectionImageData = { ...data };
      //   this.setDataLoaded();
      // } catch (e) {
      //   console.log(e);
      // }
    },
    setDataLoaded() {
      this.dataLoaded = true;
    },
    setServingStatus(status: boolean) {
      // Trigger by $emit from Serving (AsServedSelector)
      this.servingCompleteStatus = status;
      this.submit(); // Check in method whether fully complete
    },
    setLeftoverStatus(status: boolean) {
      // Trigger by $emit from Leftover (AsServedSelector)
      this.leftoverCompleteStatus = status;
      this.submit();  // Check in method whether fully complete
    },
    submit() {
      // if (this.servingIdx === null && this.leftoverIdx === null) return;

      // Check both sections are completed
      if (this.servingIdx !== null && this.leftoverIdx !== null) {
        // TODO emits only as served data
        this.$emit('as-served-selected', {
          imageIndex: this.servingIdx,
          weight: this.selectionImageData.images[this.servingIdx].weight,
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.selectedThumb {
  border: 0.1em solid #2196f3;
}
</style>
