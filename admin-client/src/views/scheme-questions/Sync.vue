<template>
  <layout :id="id" :entry="entry" v-if="entryLoaded">
    <v-card-title>{{ $t(`scheme-questions.sync.title`, { id: entry.prompt.id }) }} </v-card-title>
    <v-list two-line>
      <v-list-item
        v-for="scheme in schemes"
        :key="scheme.id"
        link
        :class="scheme.synced ? `green lighten-5` : `orange lighten-5`"
      >
        <v-list-item-avatar>
          <v-icon>fas fa-route</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-subtitle class="mb-2">
            {{ $t('schemes._') }}: {{ scheme.name }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ $t('common.status') }}: {{ $t(`scheme-questions.sync.${scheme.synced}`) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon
            v-if="scheme.synced"
            :title="$t('scheme-questions.sync.true')"
            color="success"
            large
            >fa-check-circle</v-icon
          >
          <v-btn v-else :title="$t('scheme-questions.sync.false')" icon @click.stop="sync(scheme)">
            <v-icon color="warning" large>fa-sync</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import isEqual from 'lodash/isEqual';
import { DetailMixin } from '@/types/vue';
import detailMixin from '@/components/entry/detailMixin';
import { flattenSchemeWithSection } from '@common/schemes';
import { MealSection, SurveyQuestionSection } from '@common/types';
import { SchemeQuestionEntry, SchemeQuestionRefs } from '@common/types/http/admin';

export type SchemeStatus = {
  id: string;
  name: string;
  section: SurveyQuestionSection | MealSection;
  synced: boolean;
};

export default (Vue as VueConstructor<
  Vue & DetailMixin<SchemeQuestionEntry, SchemeQuestionRefs>
>).extend({
  name: 'SchemeQuestionSync',

  mixins: [detailMixin],

  computed: {
    schemes(): SchemeStatus[] {
      return this.refs.schemes.reduce<SchemeStatus[]>((acc, scheme) => {
        const questions = flattenSchemeWithSection(scheme.questions);

        const match = questions.find((question) => question.id === this.entry.prompt.id);
        if (match) {
          const { section, ...prompt } = match;

          acc.push({
            id: scheme.id,
            name: scheme.name,
            section,
            synced: isEqual(this.entry.prompt, prompt),
          });
        }

        return acc;
      }, []);
    },
  },

  methods: {
    async sync(scheme: SchemeStatus) {
      const { prompt } = this.entry;
      const { id: schemeId, section } = scheme;

      await this.$http.post(`/admin/${this.module}/${this.id}/sync`, {
        schemeId,
        section,
        prompt,
      });
      await this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
