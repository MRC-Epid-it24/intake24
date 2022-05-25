<template>
  <prompt-layout :text="text" :description="description">
    <v-card-actions :class="isNotDesktop && 'justify-center'">
      <v-row>
        <v-col>
          <v-expansion-panels v-model="activePromptModel">
            <v-expansion-panel v-for="(assocFood, index) in associatedFoodPrompts" :key="index">
              <v-expansion-panel-header disable-icon-rotate>
                {{ assocFood.promptText }}
                <template v-slot:actions>
                  <valid-invalid-icon
                    :valid="prompts[index].confirmed !== undefined"
                  ></valid-invalid-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-btn-toggle v-model="prompts[index].confirmed" @change="updatePrompt(index)">
                  <v-btn value="false"> {{ $t('prompts.associatedFoods.no') }}</v-btn>
                  <v-btn value="true"> {{ $t('prompts.associatedFoods.yes') }}</v-btn>
                </v-btn-toggle>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-card-actions>
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapActions, mapState } from 'pinia';
import { PropType } from '@vue/composition-api';
import { BasePromptProps } from '@intake24/common/prompts';
import { useSurvey } from '@intake24/survey/stores';
import { UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'AssociatedFoodsPrompt',

  components: { ValidInvalidIcon },

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    foodName: {
      type: String,
    },
    associatedFoods: {
      type: Array as PropType<Array<UserAssociatedFoodPrompt>>,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  data() {
    const store = useSurvey();
    console.debug(`In data(): activePrompt = ${store.associatedFoodsForSelection()!.activePrompt}`);
    return {
      store,
      activePrompt: store.associatedFoodsForSelection()!.activePrompt,
      prompts: store.associatedFoodsForSelection()!.prompts,
    };
  },

  computed: {
    ...mapState(useSurvey, {
      associatedFoodPrompts: (state) => state.selectedEncodedFood?.data.associatedFoodPrompts,
      selectedFoodIndex: (state) => state.selectedFoodIndex,
      selectedMealIndex: (state) => state.selectedMealIndex,
    }),

    activePromptModel: {
      get(): number {
        return this.activePrompt;
      },

      set(value: number) {
        this.activePrompt = value;
        this.store.updateActiveAssociatedFoodsPrompt(this.activePrompt);
      },
    },

    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      return text
        ? text.replace('{food}', this.foodName ?? '')
        : this.$t('prompts.associatedFoods.text', {
            food: this.foodName?.toLocaleLowerCase(),
          }).toString();
    },
    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      return description
        ? description.replace('{food}', this.foodName ?? '')
        : this.$t('prompts.associatedFoods.description', { meal: this.foodName }).toString();
    },
  },

  beforeCreate() {
    useSurvey().initAssociatedFoodPrompts();
  },

  methods: {
    ...mapActions(useSurvey, ['updateAssociatedFoodsPrompt', 'updateActiveAssociatedFoodsPrompt']),

    updatePrompt(index: number) {
      this.store.updateAssociatedFoodsPrompt({
        promptIndex: index,
        promptState: this.prompts[index],
      });
    },

    accept() {
      console.log('accept');
    },

    reject() {
      console.log('reject');
    },

    submit() {
      this.$emit('answer', null);
    },
  },
});
</script>

<style lang="scss" scoped></style>
