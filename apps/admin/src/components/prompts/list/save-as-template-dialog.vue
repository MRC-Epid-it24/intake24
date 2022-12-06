<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-list-item v-bind="attrs" :disabled="disabled" link v-on="on">
        <v-list-item-title>
          <v-icon :disabled="disabled" left>fa-save</v-icon>
          {{ $t('survey-schemes.questions.templates.saveAs._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>{{ $t('survey-schemes.questions.templates.saveAs.title') }}</v-card-title>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.question.id"
              disabled
              hide-details="auto"
              :label="$t('survey-schemes.questions.internal.id._')"
              :messages="$t('survey-schemes.questions.internal.id.hint')"
              name="id"
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
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
          <v-col cols="12">
            <v-checkbox v-model="redirect" :label="$t('common.redirect')"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <error-list :errors="nonInputErrors" tag="v-card-text"></error-list>
      <v-card-actions class="pb-4">
        <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
          <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="font-weight-bold" color="info" text @click.stop="confirm">
          <v-icon left>$success</v-icon>{{ $t('survey-schemes.questions.templates.saveAs._') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import pick from 'lodash/pick';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { ValidationError } from '@intake24/common/types';
import type { SurveySchemeQuestionEntry } from '@intake24/common/types/http/admin';
import { ErrorList } from '@intake24/admin/components/forms';
import { form } from '@intake24/admin/helpers';
import { useEntry } from '@intake24/admin/stores';
import { copy } from '@intake24/common/util';

export type SchemeQuestionForm = {
  question: Prompt;
};

export default defineComponent({
  name: 'SaveAsTemplateDialog',

  components: { ErrorList },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    question: {
      type: Object as PropType<Prompt>,
      required: true,
    },
  },

  data() {
    return {
      form: form<SchemeQuestionForm>({
        question: this.question,
      }),
      nonInputErrorKeys: ['question'],
      dialog: false,
      redirect: false,
    };
  },

  computed: {
    ...mapState(useEntry, ['refs']),
    nonInputErrors(): ValidationError[] {
      return Object.values(pick(this.form.errors.all(), this.nonInputErrorKeys));
    },
  },

  methods: {
    ...mapActions(useEntry, ['setRefs']),

    close() {
      this.dialog = false;
    },

    cancel() {
      this.close();
    },

    async confirm() {
      const { id, question } = await this.form.post<SurveySchemeQuestionEntry>(
        'admin/survey-scheme-questions'
      );

      const templates = copy(this.refs.templates);
      templates.push(question);

      this.setRefs({ ...copy(this.refs), templates });

      this.close();

      if (this.redirect)
        await this.$router.push({ name: 'survey-scheme-questions-read', params: { id } });
    },
  },
});
</script>
