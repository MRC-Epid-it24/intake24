<template>
  <v-tabs vertical>
    <v-btn class="my-4" color="primary" @click="add">
      <v-icon left>$add</v-icon>
      {{ $t(`feedback-schemes.demographic-groups.sectors.add`) }}
    </v-btn>
    <v-tab v-for="(sector, index) in sectors" :key="index">
      <v-icon left>fas fa-scale-balanced</v-icon>
      {{ `${$t(`feedback-schemes.demographic-groups.sectors._`)} ${index + 1}` }}
    </v-tab>
    <v-tab-item v-for="(sector, index) in sectors" :key="index">
      <v-card tile>
        <v-card-title>
          <v-icon left>fas fa-scale-balanced</v-icon>
          {{ `${$t(`feedback-schemes.demographic-groups.sectors._`)} ${index + 1}` }}
        </v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="sector.sentiment"
                hide-details="auto"
                :items="sentiments"
                :label="$t('feedback-schemes.sentiments._')"
                outlined
              ></v-select>
            </v-col>
            <v-col class="d-flex justify-end" cols="12" md="6">
              <div class="mr-4 subtitle-1">
                <v-icon left>fas fa-left-right</v-icon>
                {{ $t('feedback-schemes.ranges._') }}
              </div>
              <div>
                <v-text-field
                  v-model.number="sector.range.start"
                  class="mb-4"
                  dense
                  hide-details="auto"
                  :label="$t('feedback-schemes.ranges.start')"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model.number="sector.range.end"
                  dense
                  hide-details="auto"
                  :label="$t('feedback-schemes.ranges.end')"
                  outlined
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12">
              <language-selector v-model="sector.name" :label="$t('common.name').toString()">
                <template v-for="lang in Object.keys(sector.name)" #[`lang.${lang}`]>
                  <v-text-field
                    :key="lang"
                    v-model="sector.name[lang]"
                    hide-details="auto"
                    :label="$t('common.name')"
                    outlined
                    :rules="nameRules"
                  ></v-text-field>
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12">
              <language-selector
                v-model="sector.description"
                :label="$t('common.description').toString()"
              >
                <template v-for="lang in Object.keys(sector.description)" #[`lang.${lang}`]>
                  <html-editor :key="lang" v-model="sector.description[lang]"></html-editor>
                </template>
              </language-selector>
            </v-col>
            <v-col cols="12">
              <v-btn
                block
                color="error"
                large
                :title="$t(`feedback-schemes.demographic-groups.sectors.remove`)"
                @click.stop="remove"
              >
                <v-icon left>$delete</v-icon>
                {{ $t(`feedback-schemes.demographic-groups.sectors.remove`) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { DemographicGroupScaleSector } from '@intake24/common/feedback';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { sentiments } from '@intake24/common/feedback';
import { copy } from '@intake24/common/util';

import { demographicGroupScaleSectorDefaults } from './demographic-group';

export default defineComponent({
  name: 'DemographicGroupSectors',

  components: { HtmlEditor, LanguageSelector },

  props: {
    value: {
      type: Array as PropType<DemographicGroupScaleSector[]>,
      required: true,
    },
  },

  emits: ['input'],

  data() {
    return {
      demographicGroupScaleSectorDefaults,
      sectors: this.value,
      sentiments: sentiments.map((value) => ({
        text: this.$t(`feedback-schemes.sentiments.${value}`),
        value,
      })),
    };
  },

  computed: {
    nameRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          !!value || this.$t('feedback-schemes.cards.required').toString(),
      ];
    },
  },

  watch: {
    value(val) {
      if (isEqual(val, this.sectors)) return;

      this.sectors = [...val];
    },
    sectors: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },

  methods: {
    add() {
      this.sectors.push(copy(demographicGroupScaleSectorDefaults));
    },

    remove(index: number) {
      this.sectors.splice(index, 1);
    },

    update() {
      this.$emit('input', this.sectors);
    },
  },
});
</script>

<style lang="scss" scoped></style>
