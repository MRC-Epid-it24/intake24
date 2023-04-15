<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-card-title>{{
      $t(`survey-scheme-questions.sync.title`, { id: entry.question.id })
    }}</v-card-title>
    <v-card-text v-if="!schemes.length">
      <v-alert color="primary" text type="info">
        {{ $t(`survey-scheme-questions.sync.noSchemes`) }}
      </v-alert>
    </v-card-text>
    <v-list two-line>
      <v-list-item
        v-for="scheme in schemes"
        :key="scheme.id"
        :class="scheme.synced ? `green lighten-5` : `orange lighten-5`"
      >
        <v-list-item-avatar>
          <v-icon>fas fa-route</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="mb-2">
            {{ $t('survey-schemes._') }}: {{ scheme.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('common.status') }}: {{ $t(`survey-scheme-questions.sync.${scheme.synced}`) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon
            v-if="scheme.synced"
            color="success"
            large
            :title="$t('survey-scheme-questions.sync.true')"
          >
            fa-check-circle
          </v-icon>
          <confirm-dialog
            v-else
            color="warning"
            icon
            icon-left="fa-sync"
            :label="$t('survey-scheme-questions.sync.synchronize').toString()"
            @confirm="sync(scheme)"
          >
            <template #activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                icon
                :title="$t('survey-scheme-questions.sync.false')"
                v-on="on"
              >
                <v-icon color="warning" large>fa-sync</v-icon>
              </v-btn>
            </template>
            {{ $t('survey-scheme-questions.sync.confirm') }}
          </confirm-dialog>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </layout>
</template>

<script lang="ts">
import { deepEqual } from 'fast-equals';
import { defineComponent } from 'vue';

import type { MealSection, SurveyQuestionSection } from '@intake24/common/surveys';
import type {
  SurveySchemeQuestionEntry,
  SurveySchemeQuestionRefs,
} from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { flattenSchemeWithSection } from '@intake24/common/surveys';
import { ConfirmDialog } from '@intake24/ui';

export type SchemeStatus = {
  id: string;
  name: string;
  section: SurveyQuestionSection | MealSection;
  synced: boolean;
};

export default defineComponent({
  name: 'SchemeQuestionSync',

  components: { ConfirmDialog },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<
      SurveySchemeQuestionEntry,
      SurveySchemeQuestionRefs
    >(props);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  computed: {
    schemes(): SchemeStatus[] {
      if (!this.refsLoaded) return [];

      return this.refs.schemes.reduce<SchemeStatus[]>((acc, scheme) => {
        const questions = flattenSchemeWithSection(scheme.questions);

        const match = questions.find((question) => question.id === this.entry.question.id);
        if (match) {
          const { section, ...question } = match;

          acc.push({
            id: scheme.id,
            name: scheme.name,
            section,
            synced: deepEqual(this.entry.question, question),
          });
        }

        return acc;
      }, []);
    },
  },

  methods: {
    async sync(scheme: SchemeStatus) {
      const { question } = this.entry;
      const { id: surveySchemeId, section } = scheme;

      await this.$http.post(`admin/${this.module}/${this.id}/sync`, {
        surveySchemeId,
        section,
        question,
      });
      await this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
