<template>
  <layout v-bind="{ id, entry }" :routeLeave.sync="routeLeave" @save="submit">
    <v-toolbar flat tile color="grey lighten-5" bottom>
      <v-toolbar-title class="font-weight-medium">
        {{ $t(`languages.messages.title`) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-list two-line>
      <v-list-item v-for="item in form.messages" :key="item.id" class="list-item-border" link>
        <v-list-item-avatar>
          <v-icon>fa-grip-vertical</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ $t(`languages.messages.applications.${item.application}`) }} |
            {{ getSectionTitle(item.section) }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon :title="$t('languages.messages.edit')" @click.stop="edit(item)">
            <v-icon color="primary lighten-2">$edit</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <translation-section
      :languageMessage="selected"
      @close="close"
      @update="update"
    ></translation-section>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import has from 'lodash/has';
import { LanguageEntry } from '@common/types/http/admin';
import formMixin from '@/components/entry/form-mixin';
import { form } from '@/helpers';
import { FormMixin } from '@/types';
import { LanguageMessageAttributes } from '@common/types/models';
import { copy } from '@common/util';
import TranslationSection from './translation-section.vue';

export type LanguageMessageForm = {
  id: string | null;
  messages: LanguageMessageAttributes[];
};

export default (Vue as VueConstructor<Vue & FormMixin<LanguageEntry>>).extend({
  name: 'LanguageMessages',

  components: { TranslationSection },

  mixins: [formMixin],

  data() {
    return {
      form: form<LanguageMessageForm>({
        id: null,
        messages: [],
      }),
      selected: null as LanguageMessageAttributes | null,
    };
  },

  methods: {
    /*
     * formMixin override
     */
    /* toForm(data: Dictionary) {
      const { questions, ...rest } = data;
      const input = { ...rest, questions: { ...defaultQuestions, ...questions } };

      this.setOriginalEntry(input);
      this.form.load(input);
    }, */

    getSectionTitle(key: string): string {
      const check = has(this.$i18n.messages[this.$i18n.locale], `${key}.title`);
      if (check) return this.$t(`${key}.title`).toString();

      return this.$t(`languages.messages.sections.${key}`).toString();
    },

    edit(langMessage: LanguageMessageAttributes) {
      this.selected = langMessage;
    },

    update(langMessage: LanguageMessageAttributes) {
      const match = this.form.messages.find((message) => message.id === langMessage.id);

      if (match) match.messages = copy(langMessage.messages);
    },

    close() {
      this.selected = null;
    },
  },
});
</script>

<style lang="scss" scoped></style>
