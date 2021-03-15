<template>
  <v-row justify-md="center" no-gutters>
    <v-col cols="12" md="10">
      <transition name="component-fade" mode="out-in">
        <component
          v-if="loaded && currentSelection"
          :is="currentSelection.prompt.question.component"
          :key="currentSelection.prompt.question.id"
          :props="currentSelection.prompt.question.props"
          @answer="onAnswer"
          @submit="onSubmit"
        ></component>
      </transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import prompts from '@/components/prompts/';
import surveySvc from '@/services/survey.service';
import Recall from '@/util/Recall';
import { Selection } from '@common/types';
import { Scheme } from '@common/types/models';

export default Vue.extend({
  name: 'Recall',

  components: { ...prompts },

  data() {
    return {
      scheme: {} as Scheme,
      recall: {} as Recall,
    };
  },

  computed: {
    loaded(): boolean {
      return !!Object.keys(this.recall).length;
    },
    currentSelection(): Selection | null {
      return this.recall.currentSelection;
    },
  },

  async mounted() {
    const { surveyId } = this.$route.params;
    const survey = await surveySvc.surveyInfo(surveyId);
    this.scheme = survey.scheme;
    this.recall = new Recall(this.scheme);
  },

  methods: {
    onAnswer(input: string | string[]) {
      console.log('onAnswer', input);
      this.recall.answerQuestion(input);
    },

    onSubmit(input: string | string[]) {
      console.log('onSubmit', input);
      // this.recall.submit(input);
    },
  },
});
</script>

<style lang="scss">
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
