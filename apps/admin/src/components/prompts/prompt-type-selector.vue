<template>
  <v-tab-item :key="type">
    <v-container>
      <v-alert v-if="questions.length === 0" color="primary" text type="info">
        {{ $t(`survey-schemes.questions.${type}.noQuestions`) }}
      </v-alert>
      <v-row v-else>
        <v-col v-for="question in questions" :key="question.id" cols="12" md="3">
          <v-item v-slot="{ active, toggle }" :value="question.component">
            <v-card
              :color="active ? 'primary' : ''"
              dark
              height="180"
              @click.stop="tryToggle(active, toggle)"
            >
              <v-card-title class="justify-center">
                {{ $t(`survey-schemes.prompts.${question.id}.title`) }}
              </v-card-title>
              <v-card-subtitle class="text-center">
                {{ $t(`survey-schemes.prompts.${question.id}.subtitle`) }}
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
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptQuestion, QuestionType } from '@intake24/common/prompts';

export default defineComponent({
  name: 'PromptTypeSelector',

  props: {
    type: {
      type: String as PropType<QuestionType>,
      required: true,
    },
    questions: {
      type: Array as PropType<PromptQuestion[]>,
      default: () => [],
    },
  },

  methods: {
    tryToggle(active: boolean, toggle: () => void) {
      if (active) return;

      toggle();
    },
  },
});
</script>
