<template>
  <v-tab-item :key="type">
    <v-container>
      <v-alert v-if="questions.length === 0" color="primary" text type="info">
        {{ $t(`schemes.questions.${type}.noQuestions`) }}
      </v-alert>
      <v-row v-else>
        <v-col v-for="question in questions" :key="question.id" cols="12" md="3">
          <v-item v-slot:default="{ active, toggle }" :value="question.component">
            <v-card :color="active ? 'primary' : ''" dark height="180" @click.stop="toggle">
              <v-card-title class="justify-center">
                {{ $t(`schemes.prompts.${question.id}.title`) }}
              </v-card-title>
              <v-card-subtitle class="text-center">
                {{ $t(`schemes.prompts.${question.id}.subtitle`) }}
              </v-card-subtitle>
              <v-card-text v-show="active" class="text-center">
                <v-icon x-large>fa-check-circle</v-icon>
              </v-card-text>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-tab-item>
</template>
<script lang="ts">
import Vue from 'vue';
import { PromptQuestion, QuestionType } from '@intake24/common/prompts';

export default Vue.extend({
  name: 'PromptTypeSelector',

  props: {
    type: {
      type: String as () => QuestionType,
      required: true,
    },
    questions: {
      type: Array as () => PromptQuestion[],
      default: () => [],
    },
  },
});
</script>
