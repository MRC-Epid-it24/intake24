<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <template #activator="{ props }">
      <v-list-item :disabled="disabled" link v-bind="props">
        <v-list-item-title>
          <v-icon :disabled="disabled" start>
            $save
          </v-icon>
          {{ $t('survey-schemes.prompts.templates.saveAs._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="cancel" />
        <v-toolbar-title>
          {{ $t('survey-schemes.prompts.templates.saveAs.title') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.prompt.id"
              disabled
              hide-details="auto"
              :label="$t('survey-schemes.prompts.internal.id._')"
              :messages="$t('survey-schemes.prompts.internal.id.hint')"
              name="id"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.prompt.name"
              disabled
              hide-details="auto"
              :label="$t('survey-schemes.prompts.internal.name._')"
              :messages="$t('survey-schemes.prompts.internal.name.hint')"
              name="name"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12">
            <v-checkbox-btn v-model="redirect" :label="$t('common.redirect')" />
          </v-col>
        </v-row>
      </v-card-text>
      <error-list :errors="nonInputErrors" tag="v-card-text" />
      <v-card-actions class="pb-4">
        <v-btn class="font-weight-bold" color="error" variant="text" @click.stop="cancel">
          <v-icon icon="$cancel" start />{{ $t('common.action.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn class="font-weight-bold" color="info" variant="text" @click.stop="confirm">
          <v-icon icon="$success" start />{{ $t('survey-schemes.prompts.templates.saveAs._') }}
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
import type { SurveySchemePromptEntry } from '@intake24/common/types/http/admin';
import type { ValidationError } from '@intake24/common/util';
import { ErrorList } from '@intake24/admin/components/forms';
import { useEntry } from '@intake24/admin/stores';
import { createForm } from '@intake24/admin/util';
import { copy } from '@intake24/common/util';

export type SchemePromptForm = {
  prompt: Prompt;
};

export default defineComponent({
  name: 'SaveAsTemplateDialog',

  components: { ErrorList },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
  },

  data() {
    return {
      form: createForm<SchemePromptForm>({
        prompt: this.prompt,
      }),
      nonInputErrorKeys: ['prompt'],
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
      const { id, prompt } = await this.form.post<SurveySchemePromptEntry>(
        'admin/survey-scheme-prompts',
      );

      const templates = copy(this.refs.templates);
      templates.push(prompt);

      this.setRefs({ ...copy(this.refs), templates });

      this.close();

      if (this.redirect)
        await this.$router.push({ name: 'survey-scheme-prompts-read', params: { id } });
    },
  },
});
</script>
