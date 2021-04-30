<template>
  <v-container>
    <v-alert v-if="availableQuestions.length === 0" color="primary" text type="info">
      {{ emptyAlert }}
    </v-alert>
    <v-row v-if="availableQuestions.length > 0">
      <v-col v-for="question in availableQuestions" :key="question.id" cols="12" md="3">
        <v-item
          v-slot:default="{ active, toggle }"
          @change="updateQuestion(question)"
          :value="question.component"
        >
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
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import { PromptQuestion } from '@common/prompts';

export default Vue.extend({
  name: 'question-type-selector',

  props: {
    availableQuestions: {
      type: Array as PropType<PromptQuestion[]>,
      default: () => [],
    },
    emptyAlert: {
      type: String,
      required: true,
    },
  },

  methods: {
    updateQuestion(question: PromptQuestion): void {
      this.$emit('update-question', question);
    },
  },
});
</script>
