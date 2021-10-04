<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" v-if="entryLoaded" @save="submit">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.question.id"
                :label="$t('schemes.questions.id')"
                disabled
                hide-details="auto"
                name="id"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.question.name"
                :label="$t('schemes.questions.name')"
                disabled
                hide-details="auto"
                name="name"
                outlined
              ></v-text-field>
            </v-col>
            <v-col align="center">
              <v-btn class="pa-6" color="primary" outlined x-large @click="edit">
                <v-icon left>$edit</v-icon>{{ $t('scheme-questions.editTemplate') }}
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
import Vue, { VueConstructor } from 'vue';
import { customPromptQuestions, PromptQuestion } from '@common/prompts';
import { SchemeQuestionEntry, SchemeQuestionRefs } from '@common/types/http/admin';
import formMixin from '@/components/entry/formMixin';
import PromptSelector from '@/components/prompts/prompt-selector.vue';
import form from '@/helpers/Form';
import { FormMixin } from '@/types';

export type SchemeQuestionForm = {
  question: PromptQuestion;
};

export type Refs = {
  $refs: {
    selector: InstanceType<typeof PromptSelector>;
  };
};

export default (
  Vue as VueConstructor<Vue & FormMixin<SchemeQuestionEntry, SchemeQuestionRefs> & Refs>
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
