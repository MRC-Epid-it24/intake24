<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.question.id"
                :label="$t('survey-schemes.questions.internal.id._')"
                :messages="$t('survey-schemes.questions.internal.id.hint')"
                disabled
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.question.name"
                :label="$t('survey-schemes.questions.internal.name._')"
                :messages="$t('survey-schemes.questions.internal.name.hint')"
                disabled
                hide-details="auto"
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
        <v-card-text v-if="nonInputErrors.length">
          <v-alert
            v-for="error in nonInputErrors"
            :key="error.param"
            border="left"
            outlined
            type="error"
          >
            {{ error.msg }}
          </v-alert>
        </v-card-text>
        <v-card-text>
          <submit-footer :disabled="form.errors.any()"></submit-footer>
        </v-card-text>
      </v-form>
      <prompt-selector ref="selector" :questionIds="questionIds" @save="save"></prompt-selector>
    </v-container>
  </layout>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { PromptQuestion } from '@intake24/common/prompts';
import { customPromptQuestions } from '@intake24/common/prompts';
import type {
  SurveySchemeQuestionEntry,
  SurveySchemeQuestionRefs,
} from '@intake24/common/types/http/admin';
import formMixin from '@intake24/admin/components/entry/form-mixin';
import PromptSelector from '@intake24/admin/components/prompts/prompt-selector.vue';
import { form } from '@intake24/admin/helpers';
import type { FormMixin } from '@intake24/admin/types';

export type SchemeQuestionForm = {
  question: PromptQuestion;
};

export type Refs = {
  $refs: {
    selector: InstanceType<typeof PromptSelector>;
  };
};

export default (
  Vue as VueConstructor<Vue & FormMixin<SurveySchemeQuestionEntry, SurveySchemeQuestionRefs> & Refs>
).extend({
  name: 'SchemeQuestionForm',

  components: { PromptSelector },

  mixins: [formMixin],

  data() {
    return {
      form: form<SchemeQuestionForm>({
        question: customPromptQuestions[0],
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
      this.$refs.selector.edit(0, this.form.question);
    },

    save({ question }: { question: PromptQuestion; index: number }) {
      this.form.errors.clear('question');

      this.form.question = question;
    },
  },
});
</script>

<style lang="scss" scoped></style>
