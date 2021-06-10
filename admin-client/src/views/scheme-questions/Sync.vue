<template>
  <layout v-bind="{ id, entry }" v-if="entryLoaded">
    <v-card-title>{{ $t(`scheme-questions.sync.title`, { id: entry.question.id }) }}</v-card-title>
    <v-card-text v-if="!schemes.length">
      <v-alert color="primary" text type="info">
        {{ $t(`scheme-questions.sync.noSchemes`) }}
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
            {{ $t('schemes._') }}: {{ scheme.name }}
          </v-list-item-title>
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
          >
            fa-check-circle
          </v-icon>
          <confirm-dialog
            v-else
            :label="$t('scheme-questions.sync.synchronize')"
            color="warning"
            icon
            icon-left="fa-sync"
            @confirm="sync(scheme)"
          >
            <template v-slot:activator="{ attrs, on }">
              <v-btn v-bind="attrs" v-on="on" :title="$t('scheme-questions.sync.false')" icon>
                <v-icon color="warning" large>fa-sync</v-icon>
              </v-btn>
            </template>
            {{ $t('scheme-questions.sync.confirm') }}
          </confirm-dialog>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import isEqual from 'lodash/isEqual';
import { DetailMixin } from '@/types/vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
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

  components: { ConfirmDialog },

  mixins: [detailMixin],

  computed: {
    schemes(): SchemeStatus[] {
      return this.refs.schemes.reduce<SchemeStatus[]>((acc, scheme) => {
        const questions = flattenSchemeWithSection(scheme.questions);

        const match = questions.find((question) => question.id === this.entry.question.id);
        if (match) {
          const { section, ...question } = match;

          acc.push({
            id: scheme.id,
            name: scheme.name,
            section,
            synced: isEqual(this.entry.question, question),
          });
        }

        return acc;
      }, []);
    },
  },

  methods: {
    async sync(scheme: SchemeStatus) {
      const { question } = this.entry;
      const { id: schemeId, section } = scheme;

      await this.$http.post(`/admin/${this.module}/${this.id}/sync`, {
        schemeId,
        section,
        question,
      });
      await this.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
