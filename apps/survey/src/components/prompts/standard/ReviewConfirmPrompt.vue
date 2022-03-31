<template>
  <prompt-layout :text="text" :description="description">
    <v-col md="8" sm="12" class="px-0 px-sm-3 align-center text-center justify-center">
      <survey-progress-bar></survey-progress-bar>
    </v-col>
    <v-col md="8" sm="12">
      <h4>Survey title/name</h4>
      <h5>Survey meals</h5>
    </v-col>
    <template v-slot:actions>
      <p>Some buttons</p>
    </template>
  </prompt-layout>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { BasePromptProps } from '@intake24/common/prompts';
import SurveyProgressBar from '@intake24/survey/components/elements/SurveyProgressBar.vue';
import Submit from '@intake24/survey/components/prompts/actions/Submit.vue';
import BasePrompt from '../BasePrompt';

export default defineComponent({
  name: 'ReviewConfirmPrompt',

  components: { SurveyProgressBar },

  mixins: [BasePrompt, Submit],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals']),

    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      if (text) return text;
      return '';
    },

    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      if (description) return description;
      return '';
    },
  },

  methods: {
    submit() {
      this.$emit('submit');
    },
  },
});
</script>

<style lang="scss" scoped></style>
