<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item link v-bind="attrs" v-on="on" :disabled="disabled">
        <v-list-item-title>
          <v-icon left :disabled="disabled">fa-save</v-icon>
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
              :label="$t('survey-schemes.questions.internal.id._')"
              :messages="$t('survey-schemes.questions.internal.id.hint')"
              disabled
              hide-details="auto"
              name="id"
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
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
          <v-col cols="12">
            <v-checkbox v-model="redirect" :label="$t('common.redirect')"></v-checkbox>
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
      <v-card-actions class="pb-4">
        <v-btn class="font-weight-bold" color="error" text @click.stop="cancel">
          <v-icon left>$cancel</v-icon>{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="confirm">
          <v-icon left>$success</v-icon>{{ $t('survey-schemes.questions.templates.saveAs._') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue';
import pick from 'lodash/pick';
import { mapActions } from 'pinia';
import { copy } from '@intake24/common/util';
import type {
  SurveySchemeQuestionEntry,
  SurveySchemeRefs,
} from '@intake24/common/types/http/admin';
import type { PromptQuestion } from '@intake24/common/prompts';
import type { ValidationError } from '@intake24/common/types';
import type { MapRefsMixin } from '@intake24/admin/types';
import { form } from '@intake24/admin/helpers';
import mapRefs from '@intake24/admin/components/entry/map-refs';
import { useEntry } from '@intake24/admin/stores';

export type SchemeQuestionForm = {
  question: PromptQuestion;
};

export default (Vue as VueConstructor<Vue & MapRefsMixin<SurveySchemeRefs>>).extend({
  name: 'SaveAsTemplateDialog',

  mixins: [mapRefs],

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    question: {
      type: Object as PropType<PromptQuestion>,
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
    nonInputErrors(): ValidationError[] {
      return Object.values(pick(this.form.errors.all(), this.nonInputErrorKeys));
    },
  },

  methods: {
    ...mapActions(useEntry, ['updateRefs']),

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

      this.updateRefs({ ...copy(this.refs), templates });

      this.close();

      if (this.redirect)
        this.$router.push({ name: 'survey-scheme-questions-read', params: { id } });
    },
  },
});
</script>
