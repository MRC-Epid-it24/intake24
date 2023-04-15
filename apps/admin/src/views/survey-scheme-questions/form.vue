<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }" :route-leave.sync="routeLeave" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.question.id"
                disabled
                hide-details="auto"
                :label="$t('survey-schemes.questions.internal.id._')"
                :messages="$t('survey-schemes.questions.internal.id.hint')"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.question.name"
                disabled
                hide-details="auto"
                :label="$t('survey-schemes.questions.internal.name._')"
                :messages="$t('survey-schemes.questions.internal.name.hint')"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col align="center">
              <v-btn class="pa-6" color="primary" outlined x-large @click="edit">
                <v-icon left>$edit</v-icon>{{ $t('survey-scheme-questions.editTemplate') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <error-list :errors="nonInputErrors" tag="v-card-text"></error-list>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
      <prompt-selector ref="selector" :question-ids="questionIds" @save="save"></prompt-selector>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type {
  SurveySchemeQuestionEntry,
  SurveySchemeQuestionRefs,
} from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import PromptSelector from '@intake24/admin/components/prompts/prompt-selector.vue';
import { createForm } from '@intake24/admin/util';
import { infoPrompt } from '@intake24/common/prompts';

export type SchemeQuestionForm = {
  id: string | null;
  name: string | null;
  questionId: string | null;
  question: Prompt;
};

export default defineComponent({
  name: 'SchemeQuestionForm',

  components: { PromptSelector },

  mixins: [formMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<
      SurveySchemeQuestionEntry,
      SurveySchemeQuestionRefs
    >(props);

    const selector = ref<InstanceType<typeof PromptSelector>>();

    return { entry, entryLoaded, refs, refsLoaded, selector };
  },

  data() {
    const { actions, ...question } = infoPrompt;

    return {
      form: createForm<SchemeQuestionForm>({
        id: null,
        name: null,
        questionId: null,
        question,
      }),
      nonInputErrorKeys: ['question'],
    };
  },

  computed: {
    questionIds(): string[] {
      return this.refs.questionIds;
    },
  },

  methods: {
    edit() {
      this.selector?.edit(0, this.form.question);
    },

    save({ question }: { question: Prompt; index: number }) {
      this.form.errors.clear('question');

      this.form.question = question;
    },
  },
});
</script>

<style lang="scss" scoped></style>
