<template>
  <v-container>
    <portion-layout :text="text" :description="description">
      <template v-slot:headerText>
        [Associated prompt] {{ $t('portion.milkCereal.label') }}
      </template>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text>
              {{ $t('portion.milkCereal.question') }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="setDisplayQuestions(true)" :color="displayQuestionStyle('yes')">
                {{ $t('common.action.confirm.yes') }}
              </v-btn>
              <v-btn @click="setDisplayQuestions(false)" :color="displayQuestionStyle('no')">
                {{ $t('common.action.confirm.no') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="displayQuestions">
        <v-col>
          <v-expansion-panels v-model="panelOpen">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                Please select the milk you had:
                <template v-slot:actions>
                  <valid-invalid-icon :valid="foodSelected"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- Likely call from /api/foods/{locale}/lookup-in-category, below is mockup -->
                <h4>Foods in this category:</h4>
                <v-list>
                  <v-list-item @click="selectFood('almond milk')">Almond milk</v-list-item>
                  <v-list-item @click="selectFood('hot milk')">Hot milk, semi-skimmed</v-list-item>
                  <v-list-item @click="selectFood('hot milk')">Hot milk, whole</v-list-item>
                  <v-list-item @click="selectFood('milk')">Milk, semi-skimmed</v-list-item>
                  <v-list-item @click="selectFood('milk')">Milk, skimmed</v-list-item>
                </v-list>
                <v-btn>{{ $t('portion.milkCereal.foodSelectButton') }}</v-btn>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel v-if="foodSelected">
              <v-expansion-panel-header disable-icon-rotate>
                How would you like to measure the milk?
                <template v-slot:actions>
                  <valid-invalid-icon :valid="portionMethodSelected"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- Portion method - unless we should be assuming they'll measure it in bowls (as per the cerreal)? -->
                <v-row>
                  <v-col class="col-6">
                    <v-card @click="selectPortionMethod('glasses')">
                      <v-img
                        src="https://it24-dev.mrc-epid.cam.ac.uk/images/portion/gsoftdrnk.jpg"
                      ></v-img>
                      <v-card-title>In glasses</v-card-title>
                      <v-card-actions></v-card-actions>
                    </v-card>
                  </v-col>
                  <v-col class="col-6">
                    <v-card @click="selectPortionMethod('bowls')">
                      <v-img
                        src="https://it24-dev.mrc-epid.cam.ac.uk/images/cereal/milkbowlA.jpg"
                      ></v-img>
                      <v-card-title>In bowls</v-card-title>
                      <v-card-actions></v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel v-if="foodSelected">
              <v-expansion-panel-header disable-icon-rotate>
                Select how much milk you had:
                <template v-slot:actions>
                  <valid-invalid-icon :valid="portionSelected"></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>Please choose the level your milk came up to (without cereal).</p>
                <!-- Portion estimation - this will display the asServed gallery for the selected milk, using the bowl reference it was passed -->
                <v-img :src="imageMapData.baseImageUrl" @click="selectPortion()"></v-img>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- <v-card>Milk Cereal Prompt content here</v-card> -->
          <!-- select food -->
          <!-- portion size estimation -->
          <!-- portion size method -->
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="submit()" :color="submitButtonStyle()">
            {{ $t('common.action.continue') }}
          </v-btn>
        </v-col>
      </v-row>
    </portion-layout>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { merge } from '@intake24/common/util';
import type { MilkCerealPromptProps } from '@intake24/common/prompts';
import { milkCerealPromptDefaultProps } from '@intake24/common/prompts';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import expansionPanelControls from '@intake24/survey/components/mixins/expansionPanelControls';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import BasePortion from './BasePortion';

export default defineComponent({
  name: 'MilkCerealPrompt',

  components: {
    ValidInvalidIcon,
  },

  mixins: [BasePortion, localeContent, expansionPanelControls],

  props: {
    // Generic object 'props' used to store all props for each prompt
    promptProps: {
      type: Object as PropType<MilkCerealPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      ...merge(milkCerealPromptDefaultProps, this.promptProps),
      errors: [] as string[],
      displayQuestions: false as boolean,
      // Below are rough/testing vars to control UI prototype
      bowlType: 'A' as string, // For testing until food linking
      foodSelected: false as boolean,
      foodValue: '' as string,
      foodCode: 'SMLK' as string,
      foodData: [] as any,
      portionMethodSelected: false as boolean,
      portionMethodValue: '' as string,
      portionSelected: false as boolean,
      portionValue: '' as string,
      imageMapId: 'milkbowlA',
      imageMapData: [] as any,
      imageMapLoaded: false as boolean,
      // If MCRL (milk_in_cereal) associated food category is triggered, we will wind up here
      // Associated_foods contains `text` field which is the question
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
    // TODO: fix this as no milk will be false and not validate
    displayQuestionStyle(button: string) {
      if (button === 'yes' && this.displayQuestions) {
        return 'success';
      }
      return '';
    },
    async fetchFoodData() {
      const locale = 'en_GB';
      try {
        const { data } = await this.$http.get(`foods/image-maps/${locale}/${this.foodCode}`);
        this.foodData = { ...data };
        // this.imageMapLoaded = true;
      } catch (e) {
        console.log(e);
      }
    },
    async fetchImageMapData() {
      try {
        const { data } = await this.$http.get(`portion-sizes/image-maps/${this.imageMapId}`);
        this.imageMapData = { ...data };
        this.imageMapLoaded = true;
      } catch (e) {
        console.log(e);
      }
    },
    setDisplayQuestions(value: boolean) {
      this.displayQuestions = value;
    },
    emitFoodSelected(value: string) {
      this.foodValue = value;
      this.foodSelected = true;
      this.setPanelOpen(1);
    },
    selectPortionMethod(value: string) {
      this.portionMethodSelected = true;
      this.portionMethodValue = value;
      this.setPanelOpen(2);
      if (!this.imageMapLoaded) {
        this.fetchImageMapData();
      }
    },
    selectPortion() {
      this.portionSelected = true;
      this.setPanelOpen(-1);
    },
    submitButtonStyle() {
      if (this.foodSelected && this.portionMethodSelected && this.portionSelected) {
        return 'success';
      }
      return 'disabled';
    },
    submit() {
      if (this.foodSelected && this.portionMethodSelected && this.portionSelected) {
        console.log('submitted');
      } else {
        console.log('not complete');
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
