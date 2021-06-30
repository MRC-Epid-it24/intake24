<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        {{ $t('portion.cereal.label') }}
      </template>
      <v-row>
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                Please select the bowl that looks most like the one you used.
                <template v-slot:actions>
                  <valid-invalid-icon :valid="bowlComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-img :src="bowlImageMapData.baseImageUrl" @click="selectBowl()"></v-img>
                <!-- Image_maps gbowl -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                Using these pictures, please choose how much chocolate hoops cereal you had.
                <template v-slot:actions>
                  <valid-invalid-icon :valid="asServedComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <as-served-selector
                  :asServedSetId="this.cerealType"
                  @as-served-selector-submit="setAsServedStatus($event)"
                ></as-served-selector>
                <!-- cereal_hoopA -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                Leftovers
                <template v-slot:actions>
                  <valid-invalid-icon :valid="leftoverComplete"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <p>
                      {{ $t('portion.asServed.leftoverQuestion', { food: localeDescription }) }}
                    </p>
                    <v-btn @click="leftoverAnswer(true)">
                      {{ $t('common.confirm.yes') }}
                    </v-btn>
                    <v-btn @click="leftoverAnswer(false)">
                      {{ $t('common.confirm.no') }}
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row v-if="showLeftovers">
                  <v-col>
                    <as-served-selector
                      :asServedSetId="this.cerealType"
                      @as-served-selector-submit="setLeftoverStatus($event)"
                    ></as-served-selector>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="submit()" :color="submitButtonStyle()">
            {{ $t('common.continue') }}
          </v-btn>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import merge from 'deepmerge';
import { CerealPromptProps, cerealPromptDefaultProps } from '@common/prompts';
import localeContent from '@/components/mixins/localeContent';
import AsServedSelector from '@/components/prompts/portion/AsServedSelector.vue';
import ValidInvalidIcon from '@/components/elements/ValidInvalidIcon.vue';
import BasePortion, { Portion } from './BasePortion';

export default (Vue as VueConstructor<Vue & Portion>).extend({
  name: 'CerealPrompt',

  components: {
    AsServedSelector,
    ValidInvalidIcon,
  },

  mixins: [BasePortion, localeContent],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as () => CerealPromptProps,
    },
  },

  data() {
    return {
      ...merge(cerealPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      panelOpen: 0,
      // asServedSetId: cereal_rkrisA
      // Foodcode: RCKP
      // Testing/prototyping variables
      bowlImageMapId: 'gbowl' as string,
      bowlImageMapData: [] as any,
      bowlType: '' as string,
      cerealType: 'cereal_hoopA' as string,
      asServedData: [] as any,
      leftoverData: [] as any,
      bowlComplete: false as boolean,
      asServedComplete: false as boolean,
      leftoverComplete: false as boolean,
      showLeftovers: false as boolean,
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

  mounted() {
    this.fetchBowlImageMap();
    // this.fetchAsServedData();
    // this.fetchLeftoverData();
  },

  methods: {
    async fetchBowlImageMap() {
      try {
        const { data } = await this.$http.get(
          `portion-sizes/image-maps/${this.bowlImageMapId}`
        );
        this.bowlImageMapData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },

    async fetchAsServedData() {
      try {
        const { data } = await this.$http.get(
          `portion-sizes/as-served-sets/${this.cerealType}`
        );
        this.asServedData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },

    async fetchLeftoverData() {
      try {
        const { data } = await this.$http.get(
          `portion-sizes/image-maps/${this.bowlImageMapId}`
        );
        this.leftoverData = { ...data };
      } catch (e) {
        console.log(e);
      }
    },

    setPanelOpen(value: number) {
      this.panelOpen = value;
    },

    leftoverAnswer(value: boolean) {
      if (value) {
        this.showLeftovers = true;
      } else {
        this.leftoverComplete = true;
        this.setPanelOpen(-1);
      }
    },

    selectBowl() {
      this.bowlComplete = true;
      this.setPanelOpen(1);
    },

    setAsServedStatus(status: Record<string, unknown>) {
      this.asServedComplete = true;
      this.setPanelOpen(2);
    },

    setLeftoverStatus(status: Record<string, unknown>) {
      this.leftoverComplete = true;
      this.setPanelOpen(-1);
    },

    submitButtonStyle() {
      if (this.bowlComplete && this.asServedComplete && this.leftoverComplete) {
        return 'success';
      }
      return '';
    },
    submit() {
      if (this.bowlComplete && this.asServedComplete && this.leftoverComplete) {
        console.log("submitted");
      }
    }
  }
});
</script>

<style lang="scss" scoped></style>
